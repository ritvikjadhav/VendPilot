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

    if (
        !fullName ||
        !email ||
        !password ||
        !confirmPassword ||
        !acceptTerms ||
        !submitButton ||
        !message
    ) {
        console.error("Bizora: Required registration elements are missing.");
        return;
    }

    const buttonLabel = submitButton.querySelector("span");

    function showMessage(text, type = "error") {
        message.textContent = text;
        message.className = `form-message is-${type}`;
        message.hidden = false;
    }

    function clearMessage() {
        message.textContent = "";
        message.className = "form-message";
        message.hidden = true;
    }

    function setInvalid(field, invalid) {
        field.setAttribute("aria-invalid", String(invalid));
    }

    form.addEventListener("input", clearMessage);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        const fields = [
            fullName,
            email,
            password,
            confirmPassword
        ];

        fields.forEach((field) => setInvalid(field, false));

        const name = fullName.value.trim();
        const emailAddress = email.value.trim();
        const userPassword = password.value;

        /* Validate full name */
        if (name.length < 2) {
            setInvalid(fullName, true);
            showMessage("Please enter your full name.");
            fullName.focus();
            return;
        }

        /* Validate email */
        if (!email.validity.valid || !emailAddress) {
            setInvalid(email, true);
            showMessage("Please enter a valid email address.");
            email.focus();
            return;
        }

        /* Validate password */
        if (userPassword.length < 8) {
            setInvalid(password, true);
            showMessage("Your password must contain at least 8 characters.");
            password.focus();
            return;
        }

        /* Confirm password */
        if (userPassword !== confirmPassword.value) {
            setInvalid(confirmPassword, true);
            showMessage("Your passwords don't match.");
            confirmPassword.focus();
            return;
        }

        /* Terms acceptance */
        if (!acceptTerms.checked) {
            showMessage(
                "Please agree to the Terms of Service and Privacy Policy."
            );
            acceptTerms.focus();
            return;
        }

        /* Check Supabase connection */
        const client = window.bizoraSupabase;

        if (!client?.auth) {
            showMessage(
                "Unable to connect to registration. Refresh the page and try again."
            );

            console.error(
                "Bizora: Supabase client not found. Check script loading and supabase.js."
            );

            return;
        }

        /* Prevent duplicate submissions */
        submitButton.disabled = true;

        if (buttonLabel) {
            buttonLabel.textContent = "Creating account…";
        }

        try {
            const { data, error } = await client.auth.signUp({
                email: emailAddress,
                password: userPassword,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo:
                        `${window.location.origin}/login.html`
                }
            });

            if (error) {
                console.error("Bizora registration error:", error);

                showMessage(
                    error.message || "Registration failed. Please try again."
                );

                return;
            }

            /*
             * When email confirmation is enabled, Supabase
             * normally returns a user without an active session.
             */
            if (data.user && !data.session) {
                showMessage(
                    "Your account request was received. Check your email for a confirmation link before signing in.",
                    "success"
                );

                form.reset();

                return;
            }

            /*
             * If Supabase returns an authenticated session,
             * continue to the business setup page.
             */
            if (data.session) {
                window.location.assign("./create-business.html");
                return;
            }

            showMessage(
                "Registration was submitted. Check your email for further instructions.",
                "success"
            );

        } catch (error) {
            console.error("Bizora registration error:", error);

            showMessage(
                "We couldn't complete registration. Check your connection and try again."
            );

        } finally {
            submitButton.disabled = false;

            if (buttonLabel) {
                buttonLabel.textContent = "Create account";
            }
        }
    });
}