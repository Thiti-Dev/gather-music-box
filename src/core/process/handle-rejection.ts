const WHITELIST_ERRORS: string[] = ["Input stream error", "No video id found"];

const WHITELIST_EXCEPTIONS: string[] = ["Input stream error"];

process.on("unhandledRejection", (err: any) => {
  if (
    !WHITELIST_ERRORS.some((whitelistError) =>
      err.message.includes(whitelistError)
    )
  )
    process.exit(1);
});

process.on("uncaughtException", function (err) {
  if (
    !WHITELIST_EXCEPTIONS.some((whitelistError) =>
      err.message.includes(whitelistError)
    )
  )
    process.exit(1);
});
