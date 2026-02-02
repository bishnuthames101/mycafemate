/**
 * Vercel Domain Registration Service
 *
 * Registers tenant subdomains on the Vercel project via REST API.
 * Required because Vercel's free plan doesn't support wildcard domains.
 */

import { createLogger } from "@/lib/utils/logger";

const log = createLogger("[VercelDomain]");

interface VercelDomainResponse {
  name: string;
  apexName: string;
  verified: boolean;
  error?: { code: string; message: string };
}

/**
 * Add a domain to the Vercel project.
 *
 * @param domain - Full domain to register (e.g., "cafe-abc.mycafemate.com")
 * @returns true if domain was added (or already exists), false on failure
 */
export async function addDomainToVercel(domain: string): Promise<boolean> {
  const token = process.env.DEPLOY_VERCEL_TOKEN;
  const projectId = process.env.DEPLOY_VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    log.warn(
      "DEPLOY_VERCEL_TOKEN or DEPLOY_VERCEL_PROJECT_ID not configured. Skipping domain registration."
    );
    return false;
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${projectId}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data: VercelDomainResponse = await response.json();

    if (response.ok) {
      log.info(`Domain registered on Vercel: ${domain}`);
      return true;
    }

    // Domain already exists on this project — treat as success
    if (data.error?.code === "domain_already_in_use") {
      log.info(`Domain already registered: ${domain}`);
      return true;
    }

    log.error(
      `Vercel API error for ${domain}: ${data.error?.code} - ${data.error?.message}`
    );
    return false;
  } catch (error) {
    log.error(
      `Failed to register domain ${domain}`,
      error instanceof Error ? error : undefined
    );
    return false;
  }
}
