import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  mergeGuestCart,
} from '../controllers/cartController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuthenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.post('/merge', mergeGuestCart);

export default router;
