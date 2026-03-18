package com.msanchez.CDRE.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InsufficientSourcesException extends RuntimeException {
  private static final Logger logger = LoggerFactory.getLogger(InsufficientSourcesException.class);

  public InsufficientSourcesException(String message) {
    super(message);
    logger.error("Exception " + getClass() + " thrown");
  }
}
