/**
 * Notificació a l'empleat quan arriba una foto familiar pendent.
 *
 * En producció, substituir per enviament real (Resend, SMTP, etc.) usant
 * `site_config.contact.email` com a destinatari.
 */
export async function notifyPendingFamilyPhoto(input: {
  obituaryId: string;
  obituaryName: string;
  visitCode: string;
}) {
  if (process.env.NODE_ENV === "development") {
    console.info(
      `[notifyPendingFamilyPhoto] Foto pendent: ${input.obituaryName} (${input.visitCode}) — esquela ${input.obituaryId}`,
    );
  }
}
