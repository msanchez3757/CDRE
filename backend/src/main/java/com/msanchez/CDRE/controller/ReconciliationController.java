package com.msanchez.CDRE.controller;

import com.msanchez.CDRE.model.dto.ReconcileRequestDTO;
import com.msanchez.CDRE.model.dto.ReconciliationResultDTO;
import com.msanchez.CDRE.service.ReconciliationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reconcile")
public class ReconciliationController {
    private static final Logger logger = LoggerFactory.getLogger(ReconciliationController.class);

    private final ReconciliationService reconciliationService;

    public ReconciliationController(ReconciliationService reconciliationService) {
        this.reconciliationService = reconciliationService;
    }

    @PostMapping("/medication")
    @ResponseStatus(HttpStatus.CREATED)
    public ReconciliationResultDTO reconcileMedication(@Valid @RequestBody ReconcileRequestDTO request) {
        logger.info("Received reconciliation request with {} sources", request.getSources().size());
        return reconciliationService.reconcile(request);
    }
}
