"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initLoginPasswordToggle();
    initLoginForm();
});

function initLoginPasswordToggle() {
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

function initLoginForm() {
    const form = document.getElementById("login-form");

    if (!form) return;

    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const submitButton = document.getElementById("login-submit");
    const message = document.getElementById("login-message");

    if (!email || !password || !submitButton || !message) {
        console.error("Bizora: Login form elements are missing.");
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

    form.addEventListener("input", clearMessage);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        email.removeAttribute("aria-invalid");
        password.removeAttribute("aria-invalid");

        const emailAddress = email.value.trim();
        const userPassword = password.value;

        if (!emailAddress || !email.validity.valid) {
            email.setAttribute("aria-invalid", "true");
            showMessage("Please enter a valid email address.");
            email.focus();
            return;
        }

        if (!userPassword) {
            password.setAttribute("aria-invalid", "true");
            showMessage("Please enter your password.");
            password.focus();
            return;
        }

        const client = window.bizoraSupabase;

        if (!client?.auth) {
            showMessage(
                "We couldn't connect to the sign-in service. Please refresh and try again."
            );

            console.error(
                "Bizora: Supabase client is unavailable. Check supabase.js and script order."
            );

            return;
        }

        submitButton.disabled = true;

        if (buttonLabel) {
            buttonLabel.textContent = "Signing in…";
        }

        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: emailAddress,
                password: userPassword
            });

            if (error) {
                showMessage(
                    "We couldn't sign you in. Check your email and password, and confirm your email if required."
                );

                return;
            }

            if (!data.session) {
                showMessage(
                    "No active session was created. Please try signing in again."
                );

                return;
            }

            window.location.assign("./dashboard.html");

        } catch (error) {
            console.error("Bizora sign-in error:", error);

            showMessage(
                "Something went wrong. Check your connection and try again."
            );

        } finally {
            submitButton.disabled = false;

            if (buttonLabel) {
                buttonLabel.textContent = "Sign in";
            }
        }
    });
}