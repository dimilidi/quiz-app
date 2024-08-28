package org.lididimi.quize.constants;

public class QuizConstants {
    public static final String MESSAGE_TEMPLATE = "{\"message\": \"%s\"}";

    public static final String SOMETHING_WENT_WRONG = String.format("Something went wrong.");
    public static final String INVALID_DATA = String.format("Invalid data.");
    public static final String NOT_FOUND = String.format("Not found.");

    // USER
    public static final String UNAUTHORIZED_ACCESS = String.format("Unauthorized access.");
    public static final String USER_NOT_FOUND = String.format("User not found.");
    public static final String USER_UPDATE_SUCCESS = String.format("User status updated successfully.");
    public static final String BAD_CREDENTIALS = String.format("Bad credentials.");
    public static final String UNAPPROVED = String.format("Wait for admin approval.");
    public static final String EMAIL_EXISTS = String.format("Email already exists.");
    public static final String PASSWORD_UPDATE_SUCCESS = String.format("Password changed successfully.");
    public static final String INCORRECT_OLD_PASSWORD = String.format("Incorrect old password.");
    public static final String CHECK_EMAIL = String.format("Check your email for link to reset password.");
    public static final String EMAIL_NOT_FOUND = String.format("Email not found.");
    public static final String TOKEN_EXPIRED = String.format("Token expired.");
    public static final String TOKEN_RESET_URL_BASE = "http://localhost:5173/password/reset/";
    public static final String USER_DELETE_SUCCESS = String.format("User deleted successfully.");
    public static final String ADMIN_DELETE_INVALID = String.format("At least one admin should be active");
    public static final String ADMIN_UPDATE_INVALID = String.format("At least one admin should be active");


    public static final String SUBJECT_NOT_FOUND = String.format("Subject not found");;
}

