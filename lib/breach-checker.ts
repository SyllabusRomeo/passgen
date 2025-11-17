// Have I Been Pwned API integration
export interface BreachInfo {
  found: boolean;
  count?: number;
  breachDetails?: string[];
}

export async function checkPasswordBreach(password: string): Promise<BreachInfo> {
  try {
    // Hash the password using SHA-1 (as required by HIBP API)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const prefix = hashHex.substring(0, 5).toUpperCase();
    const suffix = hashHex.substring(5).toUpperCase();
    
    // Call HIBP API (k-anonymity model)
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'PasswordGenerator-BreachChecker'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check password breach');
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    for (const line of hashes) {
      const [hash, count] = line.split(':');
      if (hash === suffix) {
        return {
          found: true,
          count: parseInt(count.trim(), 10),
          breachDetails: [`Password found in ${count.trim()} data breaches`]
        };
      }
    }
    
    return { found: false };
  } catch (error) {
    console.error('Error checking password breach:', error);
    // Return safe default - don't block if API is down
    return { found: false };
  }
}

export async function checkServiceBreach(serviceName: string): Promise<BreachInfo> {
  try {
    // Check if the service/domain has been breached
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breacheddomain/${encodeURIComponent(serviceName)}`, {
      headers: {
        'hibp-api-key': process.env.HIBP_API_KEY || '',
        'User-Agent': 'PasswordGenerator-BreachChecker'
      }
    });
    
    if (response.status === 404) {
      return { found: false };
    }
    
    if (!response.ok) {
      throw new Error('Failed to check service breach');
    }
    
    const breaches = await response.json();
    
    return {
      found: true,
      breachDetails: Array.isArray(breaches) 
        ? breaches.map((b: any) => `${b.Name} (${b.BreachDate})`)
        : [`${breaches.Name} (${breaches.BreachDate})`]
    };
  } catch (error) {
    console.error('Error checking service breach:', error);
    return { found: false };
  }
}

