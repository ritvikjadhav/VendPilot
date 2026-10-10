"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
    initRegistrationForm();
});

/* Show or hide passwords */
function initPasswordToggles() {
    document.querySelectorAll("[data-password-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(
                button.dataset.passwordTarget
            );

            if (!input) return;

            const showPassword = input.type === "password";

            input.type = showPassword ? "text" : "password";
            button.textContent = showPassword ? "Hide" : "Show";
            button.setAttribute("aria-pressed", String(showPassword));
            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    });
}

/* Registration form */
function initRegistrationForm() {
    const form = document.getElementById("register-form");

    if (!form) return;

    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const acceptTerms = document.getElementById("accept-terms");
    const submitButton = document.getElementById("register-submit");
    const message = document.getElementById("register-message");

    const showMessage = (text, type = "error") => {
        message.textContent = text;
        message.className = `form-message is-${type}`;
        message.hidden = false;
    };

    const clearMessage = () => {
        message.textContent = "";
        message.hidden = true;
        message.className = "form-message";
    };

    const setInvalid = (field, invalid) => {
        field.setAttribute("aria-invalid", String(invalid));
    };

    form.addEventListener("input", clearMessage);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        [fullName, email, password, confirmPassword].forEach((field) => {
            setInvalid(field, false);
        });

        const name = fullName.value.trim();
        const emailAddress = email.value.trim();

        if (name.length < 2) {
            setInvalid(fullName, true);
            showMessage("Please enter your full name.");
            fullName.focus();
            return;
        }

        if (!email.validity.valid || !emailAddress) {
            setInvalid(email, true);
            showMessage("Please enter a valid email address.");
            email.focus();
            return;
        }

        if (password.value.length < 8) {
            setInvalid(password, true);
            showMessage("Your password must contain at least 8 characters.");
            password.focus();
            return;
        }

        if (password.value !== confirmPassword.value) {
            setInvalid(confirmPassword, true);
            showMessage("Your passwords don't match.");
            confirmPassword.focus();
            return;
        }

        if (!acceptTerms.checked) {
            showMessage("Please agree to the Terms of Service and Privacy Policy.");
            acceptTerms.focus();
            return;
        }

        /*
         * Supabase is not connected yet.
         * Do not pretend an account has been created.
         */
        if (!window.bizoraAuth?.signUp) {
            showMessage(
                "The registration service isn't connected yet. Configure Supabase to create your account."
            );
            return;
        }

        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "Creating account…";

        try {
            const result = await window.bizoraAuth.signUp({
                name,
                email: emailAddress,
                password: password.value
            });

            if (result.error) {
                showMessage(result.error);
                return;
            }

            if (result.requiresEmailConfirmation) {
                showMessage(
                    "Your account request was received. Check your email to confirm your account before signing in.",
                    "success"
                );
                form.reset();
                return;
            }

            window.location.assign("./create-business.html");
        } catch {
            showMessage(
                "We couldn't complete registration. Please try again."
            );
        } finally {
            submitButton.disabled = false;
            submitButton.querySelector("span").textContent = "Create account";
        }
    });
}
);