# Create corrected PDF (19 cm width, بدون Model, بالأرقام الصحيحة حسب طلبك)

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import pagesizes
from reportlab.lib.colors import HexColor
from reportlab.lib.units import cm

file_path = "/mnt/data/Quotation_Table_Final_Corrected.pdf"

doc = SimpleDocTemplate(file_path, pagesize=pagesizes.landscape(pagesizes.A4))

elements = []

# البيانات الصحيحة كما أرسلتها
data = [
    ["No", "Description", "Qty", "Unit Price (SR)", "Total Price (SR)"],
    ["1", "Handrail Roller for Travellator", "5", "2200", "11000"],
    ["2", "Push Buttons for Panoramic Elevator", "10", "200", "2000"],
    ["3", "Push Buttons for Service Elevator", "10", "200", "2000"],
    ["4", "Step Clip for Travellator", "100", "50", "5000"],
    ["5", "Clamp Pallet Step Spring (Left)", "100", "40", "4000"],
    ["6", "Clamp Pallet Step Spring (Right)", "100", "40", "4000"],
    ["7", "Brake Monitoring Sensor for Travellator", "2", "2400", "4800"],
]

# عرض الجدول = 19 سم
total_width = 19 * cm

proportions = [1, 5, 1.5, 2, 2]
total_prop = sum(proportions)

col_widths = [(p / total_prop) * total_width for p in proportions]

table = Table(data, colWidths=col_widths, repeatRows=1)

table.setStyle(TableStyle([
    ('GRID', (0, 0), (-1, -1), 1, HexColor("#949494")),
    ('BOX', (0, 0), (-1, -1), 1.5, HexColor("#949494")),
    ('ALIGN', (2, 1), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))

elements.append(table)

doc.build(elements)

file_path