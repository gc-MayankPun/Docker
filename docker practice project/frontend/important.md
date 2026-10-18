Incase if vite is not hot reloading changes then add polling to vite.config.js

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true
    }
    proxy: {...}
  }
```
