export default function getStatusPage() {

  const startTime = process.uptime();
  const nodeVersion = process.version;
  const environment = process.env.NODE_ENV || 'development';

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BuildEstate API - Backend Dashboard</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
          }
          
          .dashboard { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            animation: float 20s infinite linear;
          }
          
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            100% { transform: translateY(-100px) translateX(-100px); }
          }
          
          .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          
          .header .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: #16a34a;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 15px;
            border: 2px solid rgba(34, 197, 94, 0.3);
          }
          
          .status-dot {
            width: 8px;
            height: 8px;
            background: #16a34a;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
          
          .content {
            padding: 30px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .stat-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          .stat-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }
          
          .stat-icon {
            font-size: 1.5rem;
          }
          
          .stat-label {
            font-weight: 600;
            color: #374151;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 5px;
          }
          
          .stat-description {
            font-size: 0.85rem;
            color: #6b7280;
          }
          
          .api-endpoints {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
          }
          
          .api-endpoints h3 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .endpoint-list {
            display: grid;
            gap: 12px;
          }
          
          .endpoint {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            transition: all 0.2s ease;
          }
          
          .endpoint:hover {
            background: #f1f5f9;
            transform: translateX(5px);
          }
          
          .endpoint-method {
            font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
            font-size: 0.8rem;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .method-get { background: #dcfce7; color: #166534; }
          .method-post { background: #dbeafe; color: #1e40af; }
          .method-put { background: #fef3c7; color: #92400e; }
          .method-delete { background: #fee2e2; color: #dc2626; }
          
          .endpoint-path {
            font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
            font-size: 0.9rem;
            color: #374151;
            margin-left: 15px;
          }
          
          .endpoint-description {
            color: #6b7280;
            font-size: 0.85rem;
            text-align: right;
          }
          
          .info-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 4px solid #0ea5e9;
          }
          
          .info-section h3 {
            color: #0c4a6e;
            margin-bottom: 15px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .info-section p {
            color: #075985;
            margin-bottom: 15px;
          }
          
          .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          
          .feature-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            font-size: 0.9rem;
            color: #0c4a6e;
          }
          
          .footer {
            text-align: center;
            padding: 20px 30px;
            background: #f8fafc;
            color: #6b7280;
            font-size: 0.9rem;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .content { padding: 20px; }
            .stats-grid { grid-template-columns: 1fr; }
            .endpoint { flex-direction: column; align-items: flex-start; gap: 10px; }
            .endpoint-description { text-align: left; }
          }
        </style>
      </head>
      <body>
        <div class="dashboard">
          <div class="header">
            <h1>🏠 BuildEstate API</h1>
            <p class="subtitle">Real Estate Platform Backend Service</p>
            <div class="status-badge">
              <div class="status-dot"></div>
              <span>System Online</span>
            </div>
          </div>
          
          <div class="content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-label">Uptime</span>
                </div>
                <div class="stat-value">${Math.floor(startTime / 3600)}h ${Math.floor((startTime % 3600) / 60)}m</div>
                <div class="stat-description">Server running time</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">🌍</span>
                  <span class="stat-label">Environment</span>
                </div>
                <div class="stat-value">${environment}</div>
                <div class="stat-description">Current deployment environment</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">⚡</span>
                  <span class="stat-label">Node.js</span>
                </div>
                <div class="stat-value">${nodeVersion}</div>
                <div class="stat-description">Runtime version</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">🕐</span>
                  <span class="stat-label">Server Time</span>
                </div>
                <div class="stat-value">${new Date().toLocaleTimeString()}</div>
                <div class="stat-description">${new Date().toLocaleDateString()}</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">🔗</span>
                  <span class="stat-label">API Version</span>
                </div>
                <div class="stat-value">v2.0</div>
                <div class="stat-description">Latest stable release</div>
              </div>
            </div>
            
            <div class="api-endpoints">
              <h3>🔌 API Endpoints</h3>
              <div class="endpoint-list">
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-get">GET</span>
                    <span class="endpoint-path">/api/properties</span>
                  </div>
                  <span class="endpoint-description">Property listings and search</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-post">POST</span>
                    <span class="endpoint-path">/api/users/register</span>
                  </div>
                  <span class="endpoint-description">User registration</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-post">POST</span>
                    <span class="endpoint-path">/api/users/login</span>
                  </div>
                  <span class="endpoint-description">User authentication</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-get">GET</span>
                    <span class="endpoint-path">/api/appointments</span>
                  </div>
                  <span class="endpoint-description">Property viewing appointments</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-get">GET</span>
                    <span class="endpoint-path">/api/admin/dashboard</span>
                  </div>
                  <span class="endpoint-description">Admin dashboard data</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-get">GET</span>
                    <span class="endpoint-path">/health</span>
                  </div>
                  <span class="endpoint-description">Detailed health check</span>
                </div>
                
                <div class="endpoint">
                  <div style="display: flex; align-items: center;">
                    <span class="endpoint-method method-get">GET</span>
                    <span class="endpoint-path">/status</span>
                  </div>
                  <span class="endpoint-description">System status (JSON)</span>
                </div>
              </div>
            </div>
            
            <div class="info-section">
              <h3>🚀 Platform Features</h3>
              <p>BuildEstate is a comprehensive real estate platform that combines modern web technologies with AI-powered property analysis to deliver an exceptional user experience.</p>
              
              <div class="feature-list">
                <div class="feature-item">
                  <span>🏘️</span>
                  <span>Property Management</span>
                </div>
                <div class="feature-item">
                  <span>🔐</span>
                  <span>JWT Authentication</span>
                </div>
                <div class="feature-item">
                  <span>🤖</span>
                  <span>AI Property Analysis</span>
                </div>
                <div class="feature-item">
                  <span>📧</span>
                  <span>Email Notifications</span>
                </div>
                <div class="feature-item">
                  <span>📊</span>
                  <span>Admin Dashboard</span>
                </div>
                <div class="feature-item">
                  <span>🔍</span>
                  <span>Advanced Search</span>
                </div>
                <div class="feature-item">
                  <span>📱</span>
                  <span>Mobile Responsive</span>
                </div>
                <div class="feature-item">
                  <span>⚡</span>
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} BuildEstate. All rights reserved. | 
            <a href="/health">Health Check</a> | 
            <a href="/status">API Status</a> | 
            <a href="https://github.com/AAYUSH412/Real-Estate-Website" target="_blank">GitHub</a></p>
            <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.8;">
              Built with Express.js, MongoDB, and ❤️ | Last updated: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <script>
          // Auto-refresh every 30 seconds to keep stats current
          setTimeout(() => {
            window.location.reload();
          }, 30000);
          
          // Add some interactivity
          document.addEventListener('DOMContentLoaded', function() {
            // Animate stat cards on load
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 100);
            });
            
            // Add click handlers for endpoints
            document.querySelectorAll('.endpoint').forEach(endpoint => {
              endpoint.addEventListener('click', function() {
                const path = this.querySelector('.endpoint-path').textContent;
                const method = this.querySelector('.endpoint-method').textContent;
                
                if (method === 'GET' && (path === '/health' || path === '/status')) {
                  window.open(path, '_blank');
                }
              });
            });
          });
        </script>
      </body>
    </html>`;
};