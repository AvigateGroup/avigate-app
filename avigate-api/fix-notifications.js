const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/modules/route/services/trip.service.ts',
  'src/modules/journey/services/journey-notification.service.ts',
  'src/modules/location-share/location-share.service.ts',
  'src/modules/community/services/feed.service.ts',
  'src/modules/admin/services/contribution-management.service.ts',
];

// Notification type mappings (data.type -> root type)
const typeReplacements = [
  { from: "'trip_started'", to: "'trip_started' as any" },
  { from: "'trip_completed'", to: "'trip_completed' as any" },
  { from: "'trip_cancelled'", to: "'trip_cancelled' as any" },
  { from: "'step_completed'", to: "'step_completed' as any" },
  { from: "'approaching'", to: "'approaching' as any" },
  { from: "'journey_start'", to: "'journey_start' as any" },
  { from: "'journey_complete'", to: "'journey_complete' as any" },
  { from: "'journey_stopped'", to: "'journey_stopped' as any" },
  { from: "'approaching_stop'", to: "'approaching_stop' as any" },
  { from: "'transfer_alert'", to: "'transfer_alert' as any" },
  { from: "'transfer_imminent'", to: "'transfer_imminent' as any" },
  { from: "'transfer_complete'", to: "'transfer_complete' as any" },
  { from: "'destination_alert'", to: "'destination_alert' as any" },
  { from: "'rating_request'", to: "'rating_request' as any" },
  { from: "'location_share'", to: "'location_share' as any" },
  { from: "'community_post'", to: "'community_post' as any" },
  { from: "'contribution_approved'", to: "'contribution_approved' as any" },
  { from: "'contribution_rejected'", to: "'contribution_rejected' as any" },
  { from: "'contribution_changes_requested'", to: "'contribution_changes_requested' as any" },
  { from: "'contribution_implemented'", to: "'contribution_implemented' as any" },
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern to match notification calls
  const pattern = /sendToUser\([^,]+,\s*\{([^}]+\{[^}]+type:\s*('[^']+')[^}]+\}[^}]*)\}/gs;

  content = content.replace(pattern, (match, innerContent, typeValue) => {
    // Find which type this is
    const typeReplacement = typeReplacements.find(t => innerContent.includes(`type: ${t.from}`));

    if (!typeReplacement) {
      return match;
    }

    modified = true;

    // Extract the notification object content
    const lines = innerContent.trim().split('\n');
    const newLines = [];
    let inDataBlock = false;
    let dataLines = [];

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('data:')) {
        inDataBlock = true;
        dataLines.push(line);
      } else if (inDataBlock) {
        dataLines.push(line);
        if (trimmedLine === '},') {
          inDataBlock = false;

          // Remove the type line from data
          const filteredDataLines = dataLines.filter(l => !l.includes('type:'));
          newLines.push(...filteredDataLines);
          dataLines = [];
        }
      } else if (trimmedLine.startsWith('title:') || trimmedLine.startsWith('body:')) {
        newLines.push(line);
      }
    });

    // Build the new notification call
    let result = match;

    // Insert type after body
    const bodyMatch = result.match(/(body:\s*[`'][^`']*[`'],?\s*\n)/);
    if (bodyMatch) {
      result = result.replace(
        bodyMatch[0],
        bodyMatch[0] + `      type: ${typeReplacement.to},\n`
      );
    }

    // Remove type from data block
    result = result.replace(/\s*type:\s*'[^']+',?\s*\n/g, '');

    return result;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${file}`);
  } else {
    console.log(`- No changes: ${file}`);
  }
});

console.log('\nDone!');
