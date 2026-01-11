# Z AI Configuration Guide for Cursor

This guide will help you verify and test your Z AI API key configuration in Cursor.

## ✅ Step 1: Verify API Key is Added

1. **Open Cursor Settings:**
   - Press `Ctrl + ,` (Windows/Linux) or `Cmd + ,` (Mac)
   - Or go to `File > Preferences > Settings`

2. **Navigate to AI Settings:**
   - Search for "API" or "AI" in the settings search bar
   - Look for sections like:
     - "Features" → "AI"
     - "Model Provider"
     - "API Keys"
     - "Custom Models"

3. **Check for Z AI:**
   - Look for "Z AI" in the provider list
   - Verify your API key is saved (it should show as `••••••••` or similar)
   - Make sure it's enabled/selected

## ✅ Step 2: Select Z AI as Active Provider

1. **In the same Settings page:**
   - Find the "Model" or "Provider" dropdown
   - Select "Z AI" from the list
   - If Z AI isn't listed, look for:
     - "Custom Provider"
     - "Custom API"
     - "Add Custom Provider"

2. **If you need to add as custom provider:**
   - Click "Add Custom Provider" or similar
   - Enter provider name: "Z AI"
   - Enter API endpoint URL (check Z AI documentation)
   - Paste your API key
   - Save

## ✅ Step 3: Test the Configuration

### Test 1: Check Model Indicator
- Look at the Cursor chat interface
- Check if it shows "Z AI" or your custom provider name
- Some versions show this in the chat header or status bar

### Test 2: Simple Query Test
Ask a simple question in the chat:
```
"Hello, are you using Z AI?"
```

### Test 3: Code Generation Test
Ask for a simple code snippet:
```
"Create a PHP function to connect to a database"
```

If Z AI is working, you should get responses from the Z AI model.

## ✅ Step 4: Verify Configuration Details

If Z AI requires specific configuration:

1. **API Endpoint:**
   - Check Z AI documentation for the correct endpoint URL
   - Common formats:
     - `https://api.z.ai/v1/chat/completions`
     - `https://api.z-ai.com/v1/completions`
   - Enter this in the "API Endpoint" field if available

2. **Model Name:**
   - Some providers require specifying a model name
   - Check Z AI docs for available models
   - Common names: `z-ai-model`, `default`, etc.

3. **Authentication:**
   - Verify the API key format matches Z AI requirements
   - Some providers use: `Bearer {key}` or just `{key}`
   - Check Z AI documentation for the correct format

## 🔧 Troubleshooting

### Issue: Z AI not appearing in provider list

**Solution:**
1. Check if Cursor supports custom providers
2. Look for "Custom" or "Other" provider option
3. You may need to configure it manually:
   - Find "Custom API" or "Custom Provider" option
   - Enter Z AI endpoint and credentials

### Issue: API key not working

**Check:**
1. ✅ API key is correct (no extra spaces)
2. ✅ API key hasn't expired
3. ✅ API key has proper permissions
4. ✅ Z AI service is accessible from your network

**Test API key directly:**

**Option 1: Using curl (Windows PowerShell or Git Bash)**
```bash
# Replace YOUR_API_KEY with your actual Z AI API key
# Replace "your-model" with the actual model name from Z AI docs
curl -X POST https://api.z.ai/v1/chat/completions `
  -H "Authorization: Bearer YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{\"model\": \"your-model\", \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]}"
```

**Option 2: Using PowerShell (Windows)**
```powershell
# Replace YOUR_API_KEY with your actual Z AI API key
$headers = @{
    "Authorization" = "Bearer YOUR_API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "your-model"
    messages = @(
        @{
            role = "user"
            content = "Hello"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.z.ai/v1/chat/completions" -Method Post -Headers $headers -Body $body
```

**Option 3: Using a simple test script**
Create a file `test-zai-api.php` in your project root:
```php
<?php
// test-zai-api.php - Quick test script for Z AI API
$apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
$apiUrl = 'https://api.z.ai/v1/chat/completions'; // Update if different

$data = [
    'model' => 'your-model', // Replace with actual model name
    'messages' => [
        [
            'role' => 'user',
            'content' => 'Hello, test message'
        ]
    ]
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response:\n";
print_r(json_decode($response, true));
```

**What to look for:**
- ✅ HTTP 200 = API key works
- ✅ Response contains message/content = API is functional
- ❌ HTTP 401 = Invalid API key
- ❌ HTTP 404 = Wrong endpoint URL
- ❌ HTTP 429 = Rate limit exceeded

**Note:** Update the endpoint URL and model name according to Z AI's actual API documentation.

### Issue: Responses not coming from Z AI

**Check:**
1. ✅ Z AI is selected as active provider in Settings
2. ✅ Restart Cursor after configuration changes
3. ✅ Check Cursor logs for errors:
   - Help → Toggle Developer Tools
   - Check Console for API errors

### Issue: Can't find AI settings

**Alternative methods:**
1. **Command Palette:**
   - Press `Ctrl + Shift + P` (or `Cmd + Shift + P`)
   - Type "settings" or "preferences"
   - Select "Preferences: Open Settings"

2. **Menu:**
   - Windows/Linux: `File > Preferences > Settings`
   - Mac: `Cursor > Preferences > Settings`

## 📋 Configuration Checklist

- [ ] API key added to Cursor Settings
- [ ] Z AI selected as active provider
- [ ] API endpoint configured (if required)
- [ ] Model name specified (if required)
- [ ] Cursor restarted after configuration
- [ ] Test query successful
- [ ] Responses confirmed from Z AI

## 🔗 Useful Resources

1. **Z AI Documentation:**
   - Check Z AI official docs for:
     - API endpoint URL
     - Authentication format
     - Available models
     - Rate limits

2. **Cursor Documentation:**
   - Check Cursor docs for:
     - Custom provider setup
     - API key configuration
     - Model switching

## 💡 Quick Verification

After configuration, you can verify by:

1. **Check Settings:**
   ```
   Settings → Features → AI → Model Provider
   Should show: "Z AI" or your custom provider name
   ```

2. **Check Chat:**
   - Look for model indicator in chat UI
   - Should display "Z AI" or provider name

3. **Test Response:**
   - Ask: "What AI model are you using?"
   - The response should indicate Z AI (if the model self-identifies)

## ⚠️ Important Notes

1. **API Key Security:**
   - Never commit API keys to version control
   - Store keys in Cursor Settings (not in project files)
   - Use environment variables if needed

2. **Rate Limits:**
   - Check Z AI rate limits
   - Monitor usage to avoid exceeding limits

3. **Cost:**
   - Be aware of Z AI pricing
   - Monitor API usage if applicable

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check Cursor Version:**
   - Make sure you're using the latest version
   - Some features may require updates

2. **Contact Support:**
   - Cursor Support: For Cursor-specific issues
   - Z AI Support: For API/authentication issues

3. **Check Logs:**
   - Enable developer tools in Cursor
   - Check console for error messages
   - Look for API-related errors

---

**Last Updated:** December 2024

