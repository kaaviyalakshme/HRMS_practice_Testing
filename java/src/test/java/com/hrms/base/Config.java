package com.hrms.base;

import java.nio.file.Path;
import java.nio.file.Paths;

/** Settings, overridable with -D system properties or environment variables. */
public final class Config {
  private Config() {}

  public static final String BASE_URL = get("BASE_URL", "https://sapiensdemo.inaivia.com");
  /** Saved signed-in session (shared with the TypeScript suite's location). */
  public static final Path AUTH_FILE = Paths.get(get("AUTH_FILE", "../playwright/.auth/user.json"));
  public static final boolean HEADLESS = Boolean.parseBoolean(get("HEADLESS", "true"));
  public static final double SLOW_MO = Double.parseDouble(get("SLOW_MO", "0"));
  public static final String USERNAME = get("HRMS_USERNAME", "");
  public static final String PASSWORD = get("HRMS_PASSWORD", "");

  static String get(String key, String fallback) {
    String v = System.getProperty(key);
    if (v == null || v.isBlank()) v = System.getenv(key);
    return (v == null || v.isBlank()) ? fallback : v;
  }
}
