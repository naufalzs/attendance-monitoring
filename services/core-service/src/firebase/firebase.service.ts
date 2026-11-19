import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Firestore, getFirestore } from 'firebase-admin/firestore';
import type { Role } from '../employees/role.enum';
import { ProfileUpdatedEvent } from '../profile/events/profile-updated.event';

const NOTIFICATIONS = 'notifications';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly app: App;
  private readonly firestore: Firestore;

  constructor(config: ConfigService) {
    this.app = initializeApp({
      credential: cert({
        projectId: config.getOrThrow<string>('FIREBASE_PROJECT_ID'),
        clientEmail: config.getOrThrow<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: config
          .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
    });
    this.firestore = getFirestore(this.app);
  }

  createCustomToken(uid: string, role: Role): Promise<string> {
    return getAuth(this.app).createCustomToken(uid, { role });
  }

  async notifyAdmin(event: ProfileUpdatedEvent): Promise<void> {
    try {
      await this.firestore.collection(NOTIFICATIONS).add({
        ...event,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      this.logger.error('Failed to notify admin', error);
    }
  }
}
