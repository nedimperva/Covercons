import type { NextApiRequest, NextApiResponse } from 'next';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

type Body = {
  svg?: string;
  width?: number;
  height?: number;
  format?: 'png' | 'webp';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { svg, width, height, format }: Body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!svg) {
      return res.status(400).json({ error: 'svg is required' });
    }

    const w = Math.max(1, Math.floor(width || 1200));
    const h = Math.max(1, Math.floor(height || 630));

    // Render SVG -> PNG with resvg
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: w },
      background: 'transparent',
    });
    const pngData = resvg.render();
    let pngBuffer = pngData.asPng();

    // If height specified and not matching aspect, resize via sharp to exact dims
    if (h && w) {
      pngBuffer = await sharp(pngBuffer).resize({ width: w, height: h, fit: 'cover' }).png().toBuffer();
    }

    if ((format || 'png') === 'webp') {
      const webp = await sharp(pngBuffer).webp({ quality: 95 }).toBuffer();
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(webp);
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(pngBuffer);
  } catch (err: any) {
    console.error('Render error', err);
    return res.status(500).json({ error: 'Failed to render image' });
  }
}

