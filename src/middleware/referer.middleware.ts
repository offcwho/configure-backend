import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RefererMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    if (req.method !== 'GET' || !req.path.startsWith('/uploads/')) {
      return next();
    }

    const allowedDomains = [
      'http://localhost:3000',
      'https://yourdomain.com',
    ];

    const referer = req.headers.referer;
    const origin = req.headers.origin;

    const isAllowed = allowedDomains.some(domain => 
      referer?.startsWith(domain) || origin === domain
    );

    if (!isAllowed) {
      console.log('Blocked direct file access:', {
        ip: req.ip,
        referer: referer,
        origin: origin,
        path: req.path
      });

      return res.status(404).json({
        message: 'Not found',
        statusCode: 404,
      });
    }

    next();
  }
}