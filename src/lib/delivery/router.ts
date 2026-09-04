// Delivery router — gets quotes from all providers and picks the best one
// Strategy: cheapest available, with fallback if one provider fails

import { porterClient } from "./porter";
import { rapidoClient } from "./rapido";
import type { DeliveryProviderClient } from "./provider-interface";
import type { DeliveryQuote, QuoteRequest } from "./types";

const providers: DeliveryProviderClient[] = [porterClient, rapidoClient];

export interface QuoteComparison {
  quotes: DeliveryQuote[];
  best: DeliveryQuote | null;
}

/**
 * Get quotes from all configured providers and return the cheapest.
 * If a provider is not configured (no API key), it's skipped.
 * If all providers fail, returns empty quotes with null best.
 */
export async function getBestQuote(req: QuoteRequest): Promise<QuoteComparison> {
  const quotes: DeliveryQuote[] = [];

  // Get quotes in parallel
  const results = await Promise.allSettled(
    providers
      .filter((p) => p.isConfigured() || p.name === "rapido") // Rapido has fallback mode
      .map((p) => p.getQuote(req))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      quotes.push(result.value);
    }
    // If rejected, we just skip that provider — don't fail the whole request
  }

  // Sort by amount (cheapest first)
  quotes.sort((a, b) => a.amount - b.amount);

  return {
    quotes,
    best: quotes[0] || null,
  };
}

/**
 * Get a quote from a specific provider (for when customer or restaurant has a preference)
 */
export async function getQuoteFromProvider(
  providerName: "porter" | "rapido",
  req: QuoteRequest
): Promise<DeliveryQuote> {
  const provider = providers.find((p) => p.name === providerName);
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider.getQuote(req);
}

/**
 * Get the provider client by name
 */
export function getProvider(name: "porter" | "rapido"): DeliveryProviderClient {
  const provider = providers.find((p) => p.name === name);
  if (!provider) {
    throw new Error(`Unknown provider: ${name}`);
  }
  return provider;
}

/**
 * Check which providers are available (configured or have fallback)
 */
export function getAvailableProviders(): string[] {
  return providers
    .filter((p) => p.isConfigured() || p.name === "rapido")
    .map((p) => p.name);
}
