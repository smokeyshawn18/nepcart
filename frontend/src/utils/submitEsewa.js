// eSewa's v2 flow expects an actual form POST with the signed fields as
// hidden inputs - not a redirect link like Polar's hosted checkout URL.
// This builds that form in memory, submits it, and navigates the browser
// away to eSewa's payment page.
export function submitEsewaForm(paymentUrl, paymentData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;

  for (const [key, value] of Object.entries(paymentData)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
