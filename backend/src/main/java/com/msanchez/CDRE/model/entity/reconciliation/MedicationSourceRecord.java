package com.msanchez.CDRE.model.entity.reconciliation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "medication_source_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationSourceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reconciliation_id", nullable = false)
    private ReconciliationRecord reconciliationRecord;

    @Column(name = "system_name", nullable = false)
    private String systemName;

    @Column(name = "medication", nullable = false)
    private String medication;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    //if pharmacy
    @Column(name = "last_filled")
    private LocalDate lastFilled;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_reliability", nullable = false)
    private SourceReliability sourceReliability;

    //AI choice
    @Column(name = "was_selected", nullable = false)
    private Boolean wasSelected = false;
}
