/** * @fileoverview RR V3 Keepalive Protocol Constants * @description Shared protocol constants for Background-Offscreen keepalive communication */ /** Keepalive Port tên */ export const RR_V3_KEEPALIVE_PORT_NAME =
  'rr_v3_keepalive' as const;
/** Keepalivetin nhắnkiểu */ export type KeepaliveMessageType =
  | 'keepalive.ping'
  | 'keepalive.pong'
  | 'keepalive.start'
  | 'keepalive.stop';
/** Keepalivetin nhắn */ export interface KeepaliveMessage {
  type: KeepaliveMessageType;
  timestamp: number;
}
/** mặc địnhheartbeatkhoảng cách(mili giây) - Offscreen khoảng cáchgửi ping */ export const DEFAULT_KEEPALIVE_PING_INTERVAL_MS = 20_000;
/** tối đaheartbeatkhoảng cách(mili giây)- Chrome MV3 SW 30s */ export const MAX_KEEPALIVE_PING_INTERVAL_MS = 25_000;
