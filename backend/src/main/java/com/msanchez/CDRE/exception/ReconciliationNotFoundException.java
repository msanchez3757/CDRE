package com.msanchez.CDRE.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ReconciliationNotFoundException extends RuntimeException {
  private static final Logger logger = LoggerFactory.getLogger(ReconciliationNotFoundException.class);

  public ReconciliationNotFoundException(String message) {
    super(message);
    logger.error("Exception " + getClass() + " thrown");
  }
}
