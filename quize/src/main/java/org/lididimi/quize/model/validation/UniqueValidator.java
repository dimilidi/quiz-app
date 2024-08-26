package org.lididimi.quize.model.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.lang.reflect.Method;

public class UniqueValidator implements ConstraintValidator<Unique, String> {

    @Autowired
    private ApplicationContext applicationContext;

    private String fieldName;
    private Class<?> repositoryClass;

    @Override
    public void initialize(Unique unique) {
        this.fieldName = unique.fieldName();
        this.repositoryClass = unique.repository();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Consider null valid. Use @NotNull to check for null values.
        }

        try {
            Object repository = applicationContext.getBean(repositoryClass);
            Method method = repositoryClass.getMethod("existsBy" + capitalize(fieldName), String.class);
            return !(boolean) method.invoke(repository, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
