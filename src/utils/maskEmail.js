export function maskEmail(email) {
  if (!email || !email.includes("@")) {
    return "***"
  }

  const [local, domain] = email.split("@", 2)

  if (local.length <= 1) {
    return `*@${domain}`
  }

  if (local.length === 2) {
    return `${local[0]}*@${domain}`
  }

  return `${local[0]}***${local[local.length - 1]}@${domain}`
}
