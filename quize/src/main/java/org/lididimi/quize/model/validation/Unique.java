package org.lididimi.quize.model.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Constraint(validatedBy = UniqueValidator.class)
public @interface Unique {
    String message() default "This value must be unique.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String fieldName(); // Field name to be checked for uniqueness

    Class<?> repository(); // Repository to be used for checking uniqueness
}

