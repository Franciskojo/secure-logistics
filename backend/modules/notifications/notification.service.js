import Client from '../clients/client.model.js';

/**
 * Simulates sending a secure corporate email notification.
 * In a real-world scenario, this would use Nodemailer or an external API like SendGrid.
 */
export const sendShipmentInitiatedNotification = async (clientIds, shipment) => {
  try {
    const clients = await Client.find({ _id: { $in: clientIds } });

    for (const client of clients) {
      console.log('\n---------------------------------------------------------');
      console.log(`📡 [SECURELOGIX MAIL SERVER] - SENDING TO: ${client.email}`);
      console.log(`📧 SUBJECT: Shipment Initialized - ${shipment.trackingCode}`);
      console.log('---------------------------------------------------------');
      console.log(`Dear ${client.contactPerson},`);
      console.log(`\nYour high-value assets have been scheduled for transit.`);
      console.log(`Reference: ${shipment.trackingCode}`);
      console.log(`Origin: ${shipment.origin}`);
      console.log(`Destination: ${shipment.destination}`);
      console.log(`Security Level: ${shipment.securityLevel.toUpperCase()}`);
      console.log(`\nYou can track your shipment live at: http://localhost:5173/`);
      console.log('\nRegards,\nSecureLogix Logistics Operations');
      console.log('---------------------------------------------------------\n');
    }
  } catch (err) {
    console.error('❌ Failed to send notifications:', err.message);
  }
};

export const sendShipmentStatusUpdateNotification = async (shipmentId, status) => {
  try {
    const Shipment = (await import('../shipments/shipment.model.js')).default;
    const Client = (await import('../clients/client.model.js')).default;
    
    const shipment = await Shipment.findById(shipmentId).populate('assets');
    if (!shipment) return;

    const clientIds = [...new Set(shipment.assets.map(a => a.client.toString()))];
    const clients = await Client.find({ _id: { $in: clientIds } });

    for (const client of clients) {
        console.log('\n---------------------------------------------------------');
        console.log(`📡 [SECURELOGIX MAIL SERVER] - STATUS UPDATE FOR: ${client.email}`);
        console.log(`📧 SUBJECT: Protocol Update - ${shipment.trackingCode}`);
        console.log('---------------------------------------------------------');
        console.log(`Dear ${client.contactPerson},`);
        console.log(`\nYour shipment status has transitioned to: ${status.toUpperCase()}`);
        console.log(`Tracking: ${shipment.trackingCode}`);
        console.log(`Current Location: ${shipment.currentLocation}`);
        console.log(`\nMonitor live progress: http://localhost:5173/`);
        console.log('\nRegards,\nSecureLogix Logistics Operations');
        console.log('---------------------------------------------------------\n');
    }
  } catch (err) {
    console.error('❌ Failed to send status update notification:', err.message);
  }
};
