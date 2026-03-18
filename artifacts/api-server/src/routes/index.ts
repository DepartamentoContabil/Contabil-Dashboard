import { Router, type IRouter } from "express";
import healthRouter from "./health";
import csvProxyRouter from "./csv-proxy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(csvProxyRouter);

export default router;
