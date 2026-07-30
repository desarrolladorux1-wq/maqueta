import os
import zipfile
from xml.sax.saxutils import escape

headers = [
    "DATOS_TITULAR",
    "CODIGO_USUARIO",
    "DNI",
    "ZONA",
    "REGIONES",
    "DEPARTAMENTO",
    "PROVINCIA",
    "DISTRITO",
    "CENTROPOBLADO",
    "UBIGEO",
    "ESTRATO",
    "TIPO_BENEFICIARIO",
    "NUM_SUMINISTRO",
    "NUM_INSTALACION",
    "CONCESIONARIA",
    "EMPRESA_INSTALADORA",
    "ESTADO_INSTALACION",
    "FECHA_REGISTRO",
    "FECHA_HABILITACION",
    "FUENTE",
]

rows = [
    [
        "Maria Elena Quispe Flores",
        "BG-2026-000145",
        "45892103",
        "Urbana",
        "Costa",
        "Arequipa",
        "Arequipa",
        "Yanahuara",
        "Centro urbano",
        "040101",
        "2",
        "Residencial",
        "5208079",
        "INS-5208079",
        "Calidda",
        "Instalaciones del Norte S.A.C.",
        "En construccion",
        "2025-11-15",
        "2026-01-20",
        "BonoGas 2.0",
    ],
    [
        "Carlos Alberto Mendoza Rojas",
        "BG-2026-000146",
        "40221876",
        "Rural",
        "Sierra",
        "Cajamarca",
        "San Marcos",
        "San Marcos",
        "Comunidad San Jose",
        "060901",
        "1",
        "Residencial",
        "913777",
        "INS-913777",
        "Gas Natural del Peru",
        "Gas & Hogar E.I.R.L.",
        "En construccion",
        "2025-10-02",
        "2025-12-18",
        "Portal de Habilitaciones",
    ],
    [
        "Rosa Isabel Torres Vega",
        "BG-2026-000147",
        "46123988",
        "Periurbana",
        "Selva",
        "Amazonas",
        "Bagua",
        "Bagua",
        "Anexo Nuevo Horizonte",
        "010501",
        "3",
        "Residencial",
        "5410777",
        "INS-5410777",
        "Calidda",
        "Instalagas Peru S.A.C.",
        "Liquidado",
        "2025-08-20",
        "2025-11-05",
        "BonoGas 2.0",
    ],
    [
        "Juan Carlos Perez Gomez",
        "BG-2026-000148",
        "70451288",
        "Urbana",
        "Costa",
        "Lima",
        "Lima",
        "Ate",
        "Pueblo Joven Los Olivos",
        "150103",
        "2",
        "Residencial",
        "101241",
        "INS-9344",
        "Calidda",
        "Consorcio Redes Lima",
        "Conectado",
        "2025-09-10",
        "2025-12-01",
        "BonoGas 2.0",
    ],
    [
        "Ana Lucia Huaman Soto",
        "BG-2026-000149",
        "43567891",
        "Rural",
        "Sierra",
        "Ayacucho",
        "Huamanga",
        "San Juan Bautista",
        "Centro urbano",
        "050101",
        "1",
        "Residencial",
        "100512",
        "INS-9077",
        "Promigas Peru",
        "Andes Gas Contratistas",
        "Pendiente de liquidacion",
        "2025-12-01",
        "2026-02-14",
        "Portal de Habilitaciones",
    ],
]


def col_name(n):
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


sheet_rows = []
for r_idx, row in enumerate([headers] + rows, start=1):
    cells = []
    for c_idx, val in enumerate(row, start=1):
        ref = f"{col_name(c_idx)}{r_idx}"
        cells.append(
            f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(val))}</t></is></c>'
        )
    sheet_rows.append(f'<row r="{r_idx}">{"".join(cells)}</row>')

sheet_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    "<sheetData>"
    + "".join(sheet_rows)
    + "</sheetData></worksheet>"
)

workbook_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    '<sheets><sheet name="Beneficiarios Bono Gas" sheetId="1" r:id="rId1"/></sheets>'
    "</workbook>"
)

rels_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
    "</Relationships>"
)

workbook_rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
    "</Relationships>"
)

content_types = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    "</Types>"
)

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, "assets", "formato_beneficiarios_bonogas_prueba.xlsx")
os.makedirs(os.path.dirname(out), exist_ok=True)

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels_xml)
    z.writestr("xl/workbook.xml", workbook_xml)
    z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
    z.writestr("xl/worksheets/sheet1.xml", sheet_xml)

print(out)
