package com.secure.online_voting.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfService {

    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);

    public byte[] generateResultPdf(String electionTitle, List<Map<String, Object>> results) {
        
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            // Title
            Paragraph para = new Paragraph("OFFICIAL ELECTION RESULTS", titleFont);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(new Paragraph("Election: " + electionTitle));
            document.add(new Paragraph(" ")); // Khali jagah

            // Table banaiye
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.addCell(new Phrase("Candidate Name", headFont));
            table.addCell(new Phrase("Department", headFont));
            table.addCell(new Phrase("Final Votes", headFont));

            // Map se data nikalna
            for (Map<String, Object> c : results) {
                table.addCell(String.valueOf(c.get("name")));
                table.addCell(String.valueOf(c.get("department")));
                table.addCell(String.valueOf(c.get("votes")));
            }

            document.add(table);

        } catch (DocumentException e) {
            logger.error("Error generating PDF report for election: {}", electionTitle, e);
        } finally {
            // YAHAN HAI ASLI FIX: 'finally' block ensure karega ki file hamesha safe close ho (No Warnings!)
            if (document.isOpen()) {
                document.close();
            }
            try {
                out.close();
            } catch (IOException e) {
                logger.error("Error closing stream", e);
            }
        }

        return out.toByteArray();
    }
}