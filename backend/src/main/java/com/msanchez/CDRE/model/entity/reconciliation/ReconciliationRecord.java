package com.msanchez.CDRE.model.entity.reconciliation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reconciliation_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReconciliationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;


    //Snapshot of patient context
    //No name/ID attached -- likely not a HIPPAA violation

    @Column(name = "patient_age")
    private Integer patientAge;

    @Column(name = "patient_condition")
    private String patientConditions;

    @Column(name = "recent_labs_snapshot", columnDefinition = "TEXT")
    private String recentLabsSnapshot;

    //Results

    @Column(name = "reconciled_medication", nullable = false)
    private String reconciledMedication;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Lob
    @Column(name = "reasoning", nullable = false, columnDefinition = "TEXT")
    private String reasoning;


    @ElementCollection
    @CollectionTable(
            name = "reconciliation_recommended_actions",
            joinColumns = @JoinColumn(name = "reconciliation_id")
    )
    @Column(name = "action")
    @Builder.Default
    private List<String> recommendedActions = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "clinical_safety_check", nullable = false)
    private SafetyCheckResult safetyCheckResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ReconciliationStatus status = ReconciliationStatus.PENDING;

    @OneToMany(mappedBy = "reconciliationRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MedicationSourceRecord> sources = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    public void addSource(MedicationSourceRecord source) {
        sources.add(source);
        source.setReconciliationRecord(this);
    }
}
