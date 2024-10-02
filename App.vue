<template>
  <div id="app">
    <h1>QR Code Generator</h1>
    <input v-model="qrCodeText" placeholder="Enter text or URL" />
    <button @click="generateQRCode">Generate QR Code</button>
    <div v-if="qrCodeImage">
      <h2>Your QR Code:</h2>
      <img :src="qrCodeImage" alt="QR Code" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrCodeText: '',
      qrCodeImage: ''
    };
  },
  methods: {
    async generateQRCode() {
      const response = await fetch('http://localhost:5000/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qr_code_text: this.qrCodeText })
      });
      const data = await response.json();
      this.qrCodeImage = data.image;
    }
  }
};
</script>

<style>
#app {
  text-align: center;
}
input {
  margin-bottom: 10px;
}
</style>