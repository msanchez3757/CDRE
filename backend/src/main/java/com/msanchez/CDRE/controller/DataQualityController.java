package com.msanchez.CDRE.controller;


import com.msanchez.CDRE.model.dto.DataQualityRequestDTO;
import com.msanchez.CDRE.model.dto.DataQualityResultDTO;
import com.msanchez.CDRE.service.dataquality.DataQualityService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/validate")
public class DataQualityController {

    private static final Logger logger = LoggerFactory.getLogger(DataQualityController.class);

    private final DataQualityService dataQualityService;

    public DataQualityController(DataQualityService dataQualityService) {
        this.dataQualityService = dataQualityService;
    }

    @PostMapping("/data-quality")
    @ResponseStatus(HttpStatus.OK)
    public DataQualityResultDTO validateDataQuality(@Valid @RequestBody DataQualityRequestDTO request) {
        logger.info("Received data quality validation request");
        return dataQualityService.evaluate(request);
    }
}
