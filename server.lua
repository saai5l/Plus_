-- ============================================================
--   Plus Dev Website API — QBCore
--   ضع هذا الفولدر في resources/[standalone]/plusdev-api
--   ثم أضف في server.cfg:  ensure plusdev-api
-- ============================================================

-- 🔑 غيّر هذا المفتاح لكلمة سرية خاصة بك وضعها في script.js أيضاً
local API_SECRET = "PLUSDEV_SECRET_2025_CHANGE_ME"

-- ✅ الدومين الخاص بموقعك (للحماية من طلبات غير مصرح بها)
local ALLOWED_ORIGIN = "https://saai5l.github.io"

-- ============================================================
--  HTTP Handler
-- ============================================================
SetHttpHandler(function(request, response)

    -- CORS Headers
    response.writeHead(200, {
        ['Access-Control-Allow-Origin']  = ALLOWED_ORIGIN,
        ['Access-Control-Allow-Headers'] = 'Content-Type, x-api-key',
        ['Access-Control-Allow-Methods'] = 'GET, OPTIONS',
        ['Content-Type']                 = 'application/json; charset=utf-8'
    })

    -- Preflight
    if request.method == 'OPTIONS' then
        response.send('')
        return
    end

    -- ✅ التحقق من المفتاح السري
    if request.headers['x-api-key'] ~= API_SECRET then
        response.send(json.encode({ success = false, error = 'Unauthorized' }))
        return
    end

    local path = request.path

    -- ============================================================
    --  GET /player?discord=DISCORD_ID
    --  يجيب بيانات اللاعب عبر Discord ID
    -- ============================================================
    if path == '/player' then
        local discordId = request.setDataHandler and '' or ''

        -- استخراج discord من query string
        local qs = request.path:match('%?(.+)') or ''
        for k, v in qs:gmatch('([^&=]+)=([^&=]+)') do
            if k == 'discord' then discordId = v end
        end

        -- حاول تجيب من URL المتكامل
        if request.rawPath then
            local qraw = request.rawPath:match('%?(.+)') or ''
            for k, v in qraw:gmatch('([^&=?]+)=([^&=?]+)') do
                if k == 'discord' then discordId = v end
            end
        end

        if discordId == '' then
            response.send(json.encode({ success = false, error = 'discord param missing' }))
            return
        end

        -- بحث في قاعدة البيانات عبر discord identifier
        MySQL.query(
            [[SELECT p.*, pi.metadata FROM players p
              LEFT JOIN player_info pi ON pi.citizenid = p.citizenid
              WHERE JSON_SEARCH(p.license, 'one', ?) IS NOT NULL
              OR p.citizenid IN (
                SELECT citizenid FROM players
                WHERE license LIKE ?
              )
              LIMIT 1]],
            { 'discord:' .. discordId, '%discord:' .. discordId .. '%' },
            function(result)
                if not result or not result[1] then
                    -- جرب طريقة بديلة
                    MySQL.query(
                        "SELECT * FROM players LIMIT 1",
                        {},
                        function(testResult)
                            response.send(json.encode({
                                success = false,
                                error   = 'Player not found',
                                hint    = 'تأكد أن اللاعب سجّل دخوله للسيرفر مرة واحدة على الأقل'
                            }))
                        end
                    )
                    return
                end

                local p        = result[1]
                local charinfo = json.decode(p.charinfo  or '{}') or {}
                local job      = json.decode(p.job       or '{}') or {}
                local money    = json.decode(p.money     or '{}') or {}
                local metadata = json.decode(p.metadata  or '{}') or {}

                -- حساب وقت اللعب بشكل مقروء
                local playtime    = tonumber(metadata.playtime) or 0
                local hours       = math.floor(playtime / 60)
                local mins        = playtime % 60
                local playtimeStr = string.format('%d ساعة و %d دقيقة', hours, mins)

                local playerData = {
                    success      = true,
                    citizenid    = p.citizenid or '',
                    name         = (charinfo.firstname or '') .. ' ' .. (charinfo.lastname or ''),
                    firstname    = charinfo.firstname or '',
                    lastname     = charinfo.lastname  or '',
                    nationality  = charinfo.nationality or 'غير محدد',
                    phone        = charinfo.phone or 'غير محدد',
                    job          = job.label or 'عاطل',
                    job_name     = job.name  or '',
                    job_grade    = (job.grade and job.grade.name) or '',
                    cash         = money.cash  or 0,
                    bank         = money.bank  or 0,
                    black_money  = money.black_money or 0,
                    playtime_raw = playtime,
                    playtime     = playtimeStr,
                    isdead       = metadata.isdead   or false,
                    injail       = metadata.injail   or 0,
                    -- إحصائيات إضافية
                    stress       = metadata.stress   or 0,
                    hunger       = metadata.hunger   or 100,
                    thirst       = metadata.thirst   or 100,
                }

                response.send(json.encode(playerData))
            end
        )

    -- ============================================================
    --  GET /online — عدد اللاعبين أونلاين حالياً
    -- ============================================================
    elseif path == '/online' then
        local players = GetPlayers()
        response.send(json.encode({
            success = true,
            count   = #players,
            max     = GetConvarInt('sv_maxclients', 64)
        }))

    -- ============================================================
    --  مسار غير معروف
    -- ============================================================
    else
        response.send(json.encode({ success = false, error = 'Unknown endpoint' }))
    end

end)

print('^2[Plus Dev API] ^7تم تشغيل API بنجاح ✅')
print('^3[Plus Dev API] ^7تأكد من تغيير API_SECRET في server.lua وscript.js')
