# Core Capabilities

This directory contains the `DeviceControl` abstraction layer.

## Why this layer?

Web browsers lack the security privileges to list installed OS applications, measure system app usage, or block arbitrary domains at the OS level. However, a mobile application (e.g. built with Capacitor, React Native, or native Android/Kotlin) _can_ do this using OS APIs like `PACKAGE_USAGE_STATS`, Accessibility Services, or VPN Services.

## How to implement the mobile version

1. Create a `DeviceControlNative` class that implements `IDeviceControl`.
2. Wrap your native plugin calls within that class.
3. In `DeviceControl.ts`, export the appropriate implementation depending on the platform:

```typescript
import { Capacitor } from "@capacitor/core";
import { DeviceControlNative } from "./DeviceControlNative";
import { DeviceControlWeb } from "./DeviceControlWeb";

export const DeviceControl = Capacitor.isNativePlatform()
  ? DeviceControlNative
  : DeviceControlWeb;
```
