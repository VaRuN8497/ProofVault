from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
def make(path, cgpa):
    c = canvas.Canvas(path, pagesize=landscape(A4), invariant=1)
    w, h = landscape(A4)
    c.setFillColor(HexColor('#FCFAF6')); c.rect(0,0,w,h,fill=1,stroke=0)
    c.setStrokeColor(HexColor('#C5A059')); c.setLineWidth(3); c.rect(24,24,w-48,h-48)
    c.setStrokeColor(HexColor('#064E3B')); c.setLineWidth(1); c.rect(34,34,w-68,h-68)
    c.setFillColor(HexColor('#064E3B')); c.setFont('Times-Bold',34); c.drawCentredString(w/2,h-110,'ROYAL TECH UNIVERSITY')
    c.setFont('Times-Italic',16); c.setFillColor(HexColor('#2D4A3E')); c.drawCentredString(w/2,h-140,'Office of the Registrar')
    c.setFont('Times-Roman',18); c.drawCentredString(w/2,h-200,'This is to certify that')
    c.setFont('Times-Bold',40); c.setFillColor(HexColor('#064E3B')); c.drawCentredString(w/2,h-260,'Alex Mercer')
    c.setFont('Times-Roman',18); c.setFillColor(HexColor('#2D4A3E')); c.drawCentredString(w/2,h-305,'has been awarded the degree of')
    c.setFont('Times-Bold',26); c.setFillColor(HexColor('#064E3B')); c.drawCentredString(w/2,h-345,'Bachelor of Science in Computer Science')
    c.setFont('Times-Roman',20); c.setFillColor(HexColor('#0B2418')); c.drawCentredString(w/2,h-400,f'Cumulative Grade Point Average: {cgpa}')
    c.setFont('Times-Italic',12); c.drawCentredString(w/2,70,'Credential No. RTU-2026-0417  |  Issued 15 June 2026')
    c.save()
make('demo/alex_mercer_diploma.pdf','8.7')
make('demo/alex_mercer_diploma_FORGED.pdf','9.7')
