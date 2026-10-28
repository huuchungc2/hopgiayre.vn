export interface PriceCalculationParams {
  material: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
  isCustomPrint?: boolean;
}

export interface PriceCalculationResult {
  unitPrice: number;
  totalPrice: number;
  formattedUnitPrice: string;
  formattedTotalPrice: string;
  materialName: string;
  discountPercent?: number;
  breakdown: {
    sheetSize?: string;
    description: string;
  };
}

export function calculateBoxPrice(params: PriceCalculationParams): PriceCalculationResult {
  const L = Math.max(1, Number(params.length) || 20);
  const W = Math.max(1, Number(params.width) || 15);
  const H = Math.max(1, Number(params.height) || 10);
  const Q = Math.max(1, Number(params.quantity) || 500);
  const mat = (params.material || '').toLowerCase();

  let unitPrice = 0;
  let materialName = 'Hộp Carton';
  let sheetDesc = '';

  // 1. Vỏ Hộp Quà Tết (Dựa trên formula 62 & 63 trong DB: tinh_hop_tet_2023 & tinh_hop_cao_cap_tet_2023)
  if (mat.includes('tết') || mat.includes('tet') || mat.includes('quà tết')) {
    materialName = 'Vỏ Hộp Quà Tết Cao Cấp';
    const isPremium = mat.includes('cao cấp') || L >= 35 || W >= 25;

    if (isPremium) {
      if (Q < 20) unitPrice = 70000;
      else if (Q < 30) unitPrice = 60000;
      else if (Q < 50) unitPrice = 59000;
      else if (Q < 100) unitPrice = 54000;
      else if (Q < 500) unitPrice = 52000;
      else if (Q < 1000) unitPrice = 49000;
      else if (Q < 2000) unitPrice = 47000;
      else if (Q < 5000) unitPrice = 45000;
      else if (Q < 10000) unitPrice = 43000;
      else unitPrice = 40000;
      sheetDesc = 'Hộp cứng bồi carton 2mm, ép kim nhũ vàng, có khay định hình chai rượu/hũ yến.';
    } else {
      if (Q < 20) unitPrice = 50000;
      else if (Q < 30) unitPrice = 45000;
      else if (Q < 50) unitPrice = 42000;
      else if (Q < 100) unitPrice = 40000;
      else if (Q < 500) unitPrice = 38000;
      else if (Q < 1000) unitPrice = 35000;
      else if (Q < 2000) unitPrice = 33000;
      else if (Q < 5000) unitPrice = 32000;
      else if (Q < 10000) unitPrice = 31000;
      else unitPrice = 30000;
      sheetDesc = 'Hộp quà tết âm dương có quai xách dù, in offset 4 màu sắc nét.';
    }
  }

  // 2. Hộp Cứng Cao Cấp (Quà tặng, mỹ phẩm, yến sào)
  else if (mat.includes('cứng') || mat.includes('quà tặng') || mat.includes('yến') || mat.includes('rượu')) {
    materialName = 'Hộp Cứng Cao Cấp';
    // Diện tích phôi chipboard: (L + 2H) * (W + 2H) cm2
    const areaM2 = ((L + 2 * H + 4) * (W + 2 * H + 4)) / 10000;
    const baseChipboard = areaM2 * 45000; // Giá chipboard 2mm bồi C150 cán màng
    const labor = 12000; // Công phay, bế, ráp dán hộp cứng
    const rawCost = baseChipboard + labor;

    // Chiết khấu số lượng
    const qtyMultiplier = Q >= 2000 ? 1.25 : Q >= 1000 ? 1.35 : Q >= 500 ? 1.5 : Q >= 300 ? 1.7 : 2.1;
    unitPrice = Math.round((rawCost * qtyMultiplier) / 500) * 500;
    if (unitPrice < 25000) unitPrice = 25000;
    sheetDesc = `Khổ trải phôi: ${Math.round(L + 2 * H + 4)}x${Math.round(W + 2 * H + 4)} cm. Bồi giấy C150 cán màng mờ sang trọng.`;
  }

  // 3. Carton sóng E (Đóng gói hàng online, ship COD)
  else if (mat.includes('sóng e') || mat.includes('carton') || mat.includes('cod')) {
    materialName = 'Hộp Carton Sóng E (3 Lớp)';
    // Công thức tính m2 phôi thùng nắp gài: Dài x Rộng = ((L+W)*2 + 4) x (W + H + 3) cm2
    const sheetL = (L + W) * 2 + 4;
    const sheetW = W + H + 3;
    const areaM2 = (sheetL * sheetW) / 10000;
    const pricePerM2 = 9500; // Đơn giá sóng E mộc m2
    const paperCost = areaM2 * pricePerM2;
    const fixedSetup = 350000 / Q; // Chi phí lên khuôn bế chia theo số lượng
    const dieCut = 400; // Công dập bế thành phẩm

    const rawCost = paperCost + fixedSetup + dieCut;
    const margin = Q >= 2000 ? 1.2 : Q >= 1000 ? 1.25 : Q >= 500 ? 1.35 : 1.55;
    unitPrice = Math.max(1500, Math.round((rawCost * margin) / 100) * 100);
    sheetDesc = `Khổ phôi carton trải: ${sheetL} x ${sheetW} cm (${areaM2.toFixed(3)} m²/hộp).`;
  }

  // 4. Hộp Giấy Kraft Thân Thiện Môi Trường
  else if (mat.includes('kraft')) {
    materialName = 'Hộp Giấy Kraft Nâu Mộc';
    const sheetL = (L + W) * 2 + 3;
    const sheetW = W + H + 2;
    const areaM2 = (sheetL * sheetW) / 10000;
    const paperCost = areaM2 * 8000;
    const fixedSetup = 300000 / Q;
    const rawCost = paperCost + fixedSetup + 350;
    const margin = Q >= 1000 ? 1.25 : 1.4;
    unitPrice = Math.max(1200, Math.round((rawCost * margin) / 100) * 100);
    sheetDesc = `Giấy Kraft Nhật 250gsm - 300gsm, phong cách vintage mộc.`;
  }

  // 5. Hộp Ivory / Duplex (Mỹ phẩm, bánh kẹo, thức ăn)
  else {
    materialName = 'Hộp Giấy Ivory / Duplex In Offset';
    const sheetL = (L + W) * 2 + 3;
    const sheetW = W + H + 2;
    const areaM2 = (sheetL * sheetW) / 10000;
    const paperCost = areaM2 * 11000;
    const fixedSetup = 450000 / Q;
    const rawCost = paperCost + fixedSetup + 500;
    const margin = Q >= 1000 ? 1.25 : 1.45;
    unitPrice = Math.max(1800, Math.round((rawCost * margin) / 100) * 100);
    sheetDesc = `In Offset 4 màu công nghệ Komori, cán màng bóng/mờ chống thấm.`;
  }

  const totalPrice = unitPrice * Q;

  return {
    unitPrice,
    totalPrice,
    formattedUnitPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(unitPrice),
    formattedTotalPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice),
    materialName,
    discountPercent: Q >= 2000 ? 25 : Q >= 1000 ? 20 : Q >= 500 ? 15 : 0,
    breakdown: {
      sheetSize: sheetDesc,
      description: `Đơn giá đã bao gồm: Giấy tiêu chuẩn, công in ấn và gia công bế thành phẩm. Miễn phí thiết kế 3D.`,
    },
  };
}
