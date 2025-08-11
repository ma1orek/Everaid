# Secrets Configuration Guide

## Getting Your Supabase Keys

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your EverAid project
3. Navigate to **Settings** → **API**

### Step 2: Locate Project API Keys
You'll see two important keys:

#### 🔓 `anon public` Key (SAFE for client-side)
- Used in web applications and external tools
- Can be exposed in client-side code
- Used for both `Authorization` and `apikey` headers

#### 🔒 `service_role secret` Key (DANGEROUS for client-side)
- **NEVER use this in client-side code**
- Only for server-side operations
- Has full database access

### Step 3: Copy the ANON Key
```bash
# Example anon key format:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuemhyeGt1bHhjZnBmYXhvdWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzE0MDcsImV4cCI6MjA0OTUwNzQwN30.AI_TJp4TZtKfpgC9mCwzpKPkbCF4uHkhJ_dZZpN2QDA
```

## Local Development Setup

### Create Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual keys
nano .env.local
```

### Environment Variables
```bash
# .env.local
SUPABASE_URL=https://tnzhrxkulxcfpfaxouif.supabase.co
SUPABASE_ANON_KEY=your_anon_key_from_dashboard
EDGE_GPT_URL=https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss
```

## External Tools Configuration

### Figma/Make Integration
Use these exact headers in your HTTP requests:

```http
Content-Type: application/json
Authorization: Bearer <YOUR_ANON_KEY>
apikey: <YOUR_ANON_KEY>
```

### Other Automation Tools
- **Zapier**: Store as environment variable `SUPABASE_ANON_KEY`
- **n8n**: Use credentials store for `SUPABASE_ANON_KEY`
- **Power Automate**: Create variable `SUPABASE_ANON_KEY`

## Security Best Practices

### ✅ Safe Practices
- Use `anon public` key for client-side applications
- Store keys in environment variables, not hardcoded
- Use both `Authorization` and `apikey` headers
- Rotate keys periodically in production

### ❌ Dangerous Practices
- **NEVER** use `service_role` key in client-side code
- Don't commit keys to version control
- Don't hardcode keys in source code
- Don't share keys in plain text

## Troubleshooting Auth Issues

### 401 Unauthorized Errors
1. **Check key format**: Must start with `eyJ...`
2. **Verify headers**: Need both `Authorization` AND `apikey`
3. **Confirm project**: Key must match the endpoint URL
4. **Test with cURL**:
   ```bash
   curl -X POST \
     'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'apikey: YOUR_ANON_KEY' \
     -d '{"mode":"chat","prompt":"test"}'
   ```

### Common Mistakes
- Missing `apikey` header (most common)
- Using wrong key type (`service_role` instead of `anon`)
- Typos in header names (`authorization` vs `Authorization`)
- Wrong project URL/key combination

## Environment-Specific Configuration

### Development
```typescript
// src/ai/client.ts
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || 'fallback_key';
```

### Production
- Use secure environment variable injection
- Verify keys are not exposed in build logs
- Monitor for key usage in analytics

### Figma/Make
- Store in platform's secrets manager
- Use `{{secrets.SUPABASE_ANON_KEY}}` syntax
- Test connection before deploying workflows

## Key Rotation

### When to Rotate
- Suspected compromise
- Regular security maintenance (quarterly)
- Team member changes
- Production deployments

### How to Rotate
1. Generate new key in Supabase dashboard
2. Update all environments and tools
3. Test all integrations
4. Revoke old key
5. Monitor for failures

---

**Remember**: The `anon` key is designed to be safe for client-side use. It provides row-level security and respects your database policies. Never use the `service_role` key in web applications or external tools.