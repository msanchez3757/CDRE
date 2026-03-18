package com.msanchez.CDRE.repository;

import com.msanchez.CDRE.model.entity.reconciliation.MedicationSourceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationSourceRecordRepository extends JpaRepository<MedicationSourceRecord, Long> {
    // Fetch all sources that were considered for a given reconciliation
    List<MedicationSourceRecord> findByReconciliationRecordId(Long reconciliationId);

    // Fetch only the source the AI selected as truth for a given reconciliation
    List<MedicationSourceRecord> findByReconciliationRecordIdAndWasSelectedTrue(Long reconciliationId);
}
