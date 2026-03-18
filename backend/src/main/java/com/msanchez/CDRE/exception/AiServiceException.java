package com.msanchez.CDRE.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class AiServiceException extends RuntimeException {
  private static final Logger logger = LoggerFactory.getLogger(AiServiceException.class);

  public AiServiceException(String message) {
    super(message);
    logger.error("Exception " + getClass() + " thrown");
  }
}
