const WHITELIST_ERRORS: string[] = ["Input stream error: Video unavailable"];

process.on("unhandledRejection", (err: any) => {
  if (!WHITELIST_ERRORS.includes(err.message)) process.exit(1);
});
