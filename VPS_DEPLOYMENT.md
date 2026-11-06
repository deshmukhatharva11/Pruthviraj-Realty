# VPS Deployment with Cloudflare Tunnel

This project is configured to run on **Port 3002** behind a **Cloudflare Tunnel** for the domain **`pruthvirajrealty.in`**.

---

## 1. Prerequisites on VPS (Ubuntu / Debian)

Ensure Node.js 18+ and PM2 are installed:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Install PM2 globally
sudo npm install -g pm2
```

---

## 2. Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/deshmukhatharva11/Pruthviraj-Realty.git /var/www/pruthviraj-realty
cd /var/www/pruthviraj-realty

# Install dependencies
npm install

# Create environment file from template
cp .env.local.example .env.local
nano .env.local
```

### Essential `.env.local` settings:
```env
NEXTAUTH_URL=https://pruthvirajrealty.in
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
PORT=3002
ADMIN_EMAIL=admin@pruthvirajrealty.in
ADMIN_PASSWORD=your_secure_password
```

---

## 3. Build & Run with PM2

```bash
# Build the Next.js app
npm run build

# Start using PM2
pm2 start ecosystem.config.js

# Save PM2 process list and configure auto-start on VPS boot
pm2 save
pm2 startup
```

The app will now run continuously on `http://127.0.0.1:3002`.

---

## 4. Cloudflare Tunnel Configuration

You can configure the tunnel either via the **Cloudflare Zero Trust Dashboard (easiest)** or via **CLI**.

### Option A: Via Cloudflare Zero Trust Dashboard (Recommended)
1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/) > **Networks** > **Tunnels**.
2. Click **Create a Tunnel** (select `cloudflared`).
3. Follow the one-line install command on your VPS to install and authenticate the connector.
4. Under the **Public Hostname** tab:
   * **Subdomain**: *(leave empty for root)* or `www`
   * **Domain**: `pruthvirajrealty.in`
   * **Type**: `HTTP`
   * **URL**: `localhost:3002`
5. Repeat for both `pruthvirajrealty.in` and `www.pruthvirajrealty.in`.

### Option B: Via Cloudflare CLI (`cloudflared`)
```bash
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Authenticate tunnel
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create pruthviraj-tunnel

# Copy example config
cp cloudflared-config.example.yml ~/.cloudflared/config.yml
# Edit ~/.cloudflared/config.yml with your tunnel ID and credentials file path

# Route DNS
cloudflared tunnel route dns pruthviraj-tunnel pruthvirajrealty.in
cloudflared tunnel route dns pruthviraj-tunnel www.pruthvirajrealty.in

# Install as systemd service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 5. Helpful Commands

```bash
# Check Next.js app status
pm2 status
pm2 logs pruthviraj-realty

# Restart after code update
git pull
npm install
npm run build
pm2 restart pruthviraj-realty

# Check tunnel status
sudo systemctl status cloudflared
```
