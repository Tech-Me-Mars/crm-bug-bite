// app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      // 🎨 ฟีล Bootstrap แต่ใช้ Tailwind palette
      primary: 'blue',    // .btn-primary
      secondary: 'slate', // .btn-secondary
      success: 'green',   // .btn-success
      info: 'sky',        // .btn-info
      warning: 'amber',   // .btn-warning
      error: 'red',       // .btn-danger
      neutral: 'zinc',    // ใช้กับ text/border/bg ทั่วไป
    }
  }
})
