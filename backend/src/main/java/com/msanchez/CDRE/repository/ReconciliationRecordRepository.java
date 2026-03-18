package com.msanchez.CDRE.repository;

import com.msanchez.CDRE.model.entity.reconciliation.ReconciliationRecord;
import com.msanchez.CDRE.model.entity.reconciliation.ReconciliationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReconciliationRecordRepository extends JpaRepository<ReconciliationRecord, Long> {
    // For the frontend dashboard — fetch all records by review status
    List<ReconciliationRecord> findByStatus(ReconciliationStatus status);

    // For audit purposes — fetch all reconciliations for a given medication name
    List<ReconciliationRecord> findByReconciledMedicationContainingIgnoreCase(String medication);
}
