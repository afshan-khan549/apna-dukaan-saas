import jsPDF from 'jspdf'
import type { Product, Store } from '../types'

export function downloadCatalogPdf(store: Store, products: Product[]) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const marginX = 48
  let y = 64

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(store.name, marginX, y)
  y += 22

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  if (store.category) {
    doc.text(store.category, marginX, y)
    y += 16
  }
  if (store.address) {
    doc.text(store.address, marginX, y)
    y += 16
  }
  if (store.phone) {
    doc.text(`Phone: ${store.phone}`, marginX, y)
    y += 16
  }

  y += 12
  doc.setLineWidth(0.5)
  doc.line(marginX, y, 547, y)
  y += 24

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Product / Service Catalog', marginX, y)
  y += 26

  doc.setFontSize(11)

  if (products.length === 0) {
    doc.setFont('helvetica', 'normal')
    doc.text('No products added yet.', marginX, y)
  }

  products.forEach((product, index) => {
    if (y > 760) {
      doc.addPage()
      y = 64
    }

    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${product.name}`, marginX, y)

    if (product.price !== null) {
      doc.setFont('helvetica', 'normal')
      doc.text(`Rs. ${product.price}`, 480, y)
    }
    y += 16

    if (product.description) {
      doc.setFont('helvetica', 'normal')
      const lines: string[] = doc.splitTextToSize(product.description, 460)
      doc.text(lines, marginX + 14, y)
      y += lines.length * 14
    }

    doc.setFont('helvetica', 'italic')
    doc.setTextColor(product.in_stock ? 31 : 179, product.in_stock ? 111 : 38, product.in_stock ? 92 : 30)
    doc.text(product.in_stock ? 'In stock' : 'Out of stock', marginX + 14, y)
    doc.setTextColor(0, 0, 0)
    y += 22
  })

  doc.save(`${store.slug}-catalog.pdf`)
}
