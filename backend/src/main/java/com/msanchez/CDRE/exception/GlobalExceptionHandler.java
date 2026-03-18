package com.msanchez.CDRE.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ReconciliationNotFoundException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleReconciliationNotFoundException(ReconciliationNotFoundException e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(InsufficientSourcesException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInsufficientSourcesException(InsufficientSourcesException e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(InvalidMedicationSourceException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidMedicationSourceException(InvalidMedicationSourceException e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(AiServiceException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAiServiceException(AiServiceException e) {
        return new ErrorResponse(e.getMessage());
    }

    // Handles @Valid failures on request DTOs — collects all field errors into one message
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return new ErrorResponse(errors);
    }

    // Handles malformed JSON body and invalid enum values (e.g. "source_reliability": "veryHigh")
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        return new ErrorResponse(ErrorMessages.INVALID_REQUEST.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(InvalidPatientRecordException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidPatientRecordException(InvalidPatientRecordException e) {
        return new ErrorResponse(e.getMessage());
    }
}
