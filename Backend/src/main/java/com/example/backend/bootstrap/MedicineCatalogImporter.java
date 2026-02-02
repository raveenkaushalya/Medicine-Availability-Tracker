package com.example.backend.bootstrap;

import com.example.backend.entity.MedicineMaster;
import com.example.backend.repository.MedicineMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MedicineCatalogImporter implements CommandLineRunner {

    private final MedicineMasterRepository medicineRepo;

    @Override
    public void run(String... args) throws Exception {

        // If already imported once, skip
        if (medicineRepo.count() > 0) {
            System.out.println("✅ medicine_master already has data. Skipping CSV import.");
            return;
        }

        // ✅ Track regNos we already saw (also catches duplicates inside CSV)
        Set<String> seenRegNos = new HashSet<>();

        var resource = new ClassPathResource("data/medicine_master.csv");

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            // skip header
            String header = br.readLine();
            if (header == null) return;

            List<MedicineMaster> batch = new ArrayList<>(500);
            String line;

            int skippedDuplicates = 0;
            int importedCount = 0;

            while ((line = br.readLine()) != null) {

                String[] c = line.split(",", -1);

                String regNo = clean(c, 0);
                if (regNo == null) continue;

                // ✅ Skip duplicate reg_no rows inside CSV
                if (!seenRegNos.add(regNo)) {
                    skippedDuplicates++;
                    continue;
                }

                MedicineMaster m = new MedicineMaster();
                m.setRegNo(regNo);
                m.setGenericName(clean(c, 1));
                m.setBrandName(clean(c, 2));
                m.setDosage(clean(c, 3));
                m.setPackSize(clean(c, 4));
                m.setPackType(clean(c, 5));
                m.setManufacturer(clean(c, 6));
                m.setCountry(clean(c, 7));
                m.setAgent(clean(c, 8));
                m.setRegDate(parseDate(clean(c, 9)));
                m.setSchedule(clean(c, 10));
                m.setValidation(clean(c, 11));
                m.setDossierNo(clean(c, 12));

                batch.add(m);

                if (batch.size() == 500) {
                    medicineRepo.saveAll(batch);
                    importedCount += batch.size();
                    batch.clear();
                    System.out.println("📥 Imported: " + importedCount + " medicines...");
                }
            }

            if (!batch.isEmpty()) {
                medicineRepo.saveAll(batch);
                importedCount += batch.size();
            }

            System.out.println("✅ Imported medicine_master successfully!");
            System.out.println("⚠️ Skipped duplicate reg_no rows: " + skippedDuplicates);
            System.out.println("📊 Final imported count: " + importedCount);
        }
    }

    private static String clean(String[] c, int i) {
        if (c.length <= i || c[i] == null) return null;
        String s = c[i].trim();
        if (s.isEmpty()) return null;

        // remove surrounding quotes
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1);
        }

        return s.trim();
    }

    private static LocalDate parseDate(String s) {
        try {
            if (s == null) return null;
            return LocalDate.parse(s); // yyyy-mm-dd
        } catch (Exception e) {
            return null;
        }
    }
}
