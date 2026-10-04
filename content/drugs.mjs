import { t } from './book.mjs';
export const drugClasses = {
  metformin: {
    name: t('메트포르민 · 비구아나이드', 'Metformin · biguanide', 'Metformin · biguanide'),
    mechanism: t('주로 간의 과도한 포도당 생산을 줄입니다.', 'Primarily reduces excessive glucose production by the liver.', 'Chủ yếu giảm sản xuất glucose quá mức ở gan.'),
    benefit: t('혈당을 낮추며 단독 저혈당 위험이 낮고 체중 증가가 적습니다.', 'Lowers glucose with low hypoglycemia risk alone and little weight gain.', 'Hạ đường huyết, nguy cơ hạ đường huyết thấp khi dùng đơn độc và ít tăng cân.'),
    common: t('설사·메스꺼움·복부 불편감.', 'Diarrhea, nausea and abdominal discomfort.', 'Tiêu chảy, buồn nôn và khó chịu bụng.'),
    serious: t('드물지만 젖산산증. 심한 신장기능 저하·저산소증·탈수 등에서 특히 평가가 필요합니다.', 'Rare lactic acidosis; severe kidney impairment, hypoxia or dehydration warrants particular assessment.', 'Hiếm gặp nhiễm toan lactic; cần đặc biệt đánh giá khi suy thận nặng, thiếu oxy hoặc mất nước.'),
    lifestyle: t('제형별 복용법을 따르세요. B12 감소, 조영제·수술·탈수 시 계획을 확인하세요.', 'Follow formulation-specific instructions. Review B12 and plans for contrast, surgery or dehydration.', 'Theo hướng dẫn từng dạng. Xem lại B12 và kế hoạch khi dùng cản quang, phẫu thuật hoặc mất nước.'),
    low: false, refs: ['medicines', 'janumet']
  },
  dpp4: {
    name: t('DPP-4 억제제', 'DPP-4 inhibitor', 'Thuốc ức chế DPP-4'),
    mechanism: t('인크레틴 호르몬의 분해를 억제해 혈당에 반응하는 인슐린 분비를 돕습니다.', 'Slows incretin breakdown, supporting glucose-dependent insulin release.', 'Giảm phân hủy incretin, hỗ trợ tiết insulin phụ thuộc glucose.'),
    benefit: t('혈당 개선, 대체로 체중 중립, 단독 저혈당 위험 낮음.', 'Improves glucose, usually weight-neutral, low hypoglycemia risk alone.', 'Cải thiện đường huyết, thường trung tính cân nặng, ít hạ đường huyết khi đơn độc.'),
    common: t('일부에서 두통·상기도 증상 등이 보고됩니다. 성분별 빈도는 다릅니다.', 'Headache or upper respiratory symptoms are reported with some ingredients; frequencies vary.', 'Một số hoạt chất có ghi nhận đau đầu hoặc triệu chứng hô hấp trên; tần suất khác nhau.'),
    serious: t('췌장염·심한 관절통·수포성 유사천포창 등의 경고가 있습니다. 심부전 주의는 성분별로 다릅니다.', 'Warnings include pancreatitis, severe joint pain and bullous pemphigoid. Heart failure cautions differ by ingredient.', 'Có cảnh báo viêm tụy, đau khớp nặng và pemphigoid bóng nước. Lưu ý suy tim khác theo hoạt chất.'),
    lifestyle: t('많은 성분은 신장기능에 따라 용량 검토가 필요합니다. 리나글립틴은 일반적으로 신장 용량 조정이 필요하지 않습니다.', 'Many ingredients need dose review with kidney impairment. Linagliptin generally does not require renal dose adjustment.', 'Nhiều hoạt chất cần xem liều khi suy thận. Linagliptin thường không cần chỉnh liều theo thận.'),
    low: false, refs: ['medicines', 'janumet', 'saxagliptin']
  },
  sglt2: {
    name: t('SGLT2 억제제', 'SGLT2 inhibitor', 'Thuốc ức chế SGLT2'),
    mechanism: t('콩팥에서 포도당 재흡수를 줄여 소변으로 배출합니다.', 'Reduces kidney glucose reabsorption so glucose is excreted in urine.', 'Giảm tái hấp thu glucose ở thận để thải qua nước tiểu.'),
    benefit: t('혈당·체중에 도움이 되고, 특정 성분은 심부전·콩팥 결과 개선이 입증됐습니다.', 'Helps glucose and weight; selected ingredients have proven heart failure and kidney outcome benefits.', 'Có ích cho đường huyết, cân nặng; một số hoạt chất có lợi ích suy tim và thận đã chứng minh.'),
    common: t('생식기 진균감염·소변 증가. 탈수·저혈압에 주의합니다. 요로감염과 생식기 감염은 구분합니다.', 'Genital fungal infections and increased urination; consider dehydration and low blood pressure. Urinary and genital infections differ.', 'Nhiễm nấm sinh dục, tiểu nhiều; chú ý mất nước và huyết áp thấp. Phân biệt nhiễm trùng tiểu với sinh dục.'),
    serious: t('드문 케톤산증은 혈당이 아주 높지 않아도 생길 수 있습니다. 심한 감염 증상도 신속히 평가해야 합니다.', 'Rare ketoacidosis can occur without very high glucose. Severe infection symptoms also need prompt assessment.', 'Nhiễm toan ceton hiếm gặp có thể xảy ra dù đường huyết không quá cao. Triệu chứng nhiễm trùng nặng cũng cần đánh giá sớm.'),
    lifestyle: t('장기 금식·극단적 저탄수화물·탈수·수술 시 의료진의 별도 계획이 필요합니다. 수분 제한이 있다면 이를 따르세요.', 'Discuss a plan for prolonged fasting, extreme carbohydrate restriction, dehydration or surgery. Respect prescribed fluid limits.', 'Cần kế hoạch khi nhịn ăn dài, ít carbohydrate cực đoan, mất nước hoặc phẫu thuật. Tuân thủ hạn chế dịch đã kê.'),
    low: false, refs: ['medicines', 'synjardy', 'cardiovascular']
  },
  su: {
    name: t('설폰요소제', 'Sulfonylurea', 'Sulfonylurea'),
    mechanism: t('췌장 베타세포의 인슐린 분비를 자극합니다.', 'Stimulates pancreatic beta cells to release insulin.', 'Kích thích tế bào beta tuyến tụy tiết insulin.'),
    benefit: t('혈당 강하 효과가 있고 비용이 비교적 낮습니다.', 'Effective glucose lowering and relatively low cost.', 'Hạ đường huyết hiệu quả, chi phí tương đối thấp.'),
    common: t('저혈당·체중 증가.', 'Hypoglycemia and weight gain.', 'Hạ đường huyết và tăng cân.'),
    serious: t('심하거나 오래 지속되는 저혈당, 특히 고령·신장기능 저하·식사 부족에서 주의.', 'Severe or prolonged hypoglycemia, especially with older age, kidney impairment or poor intake.', 'Hạ đường huyết nặng hoặc kéo dài, nhất là cao tuổi, suy thận hoặc ăn ít.'),
    lifestyle: t('끼니 거르기·운동량 증가·음주 때 저혈당 계획을 확인하세요. 성분별 위험이 같지는 않습니다.', 'Review plans for skipped meals, more exercise or alcohol. Risk differs across ingredients.', 'Xem kế hoạch khi bỏ bữa, tăng vận động hoặc uống rượu. Nguy cơ khác theo hoạt chất.'),
    low: true, refs: ['medicines', 'hypoglycemia']
  },
  glinide: {
    name: t('메글리티나이드 · 글리나이드', 'Meglitinide · glinide', 'Meglitinide · glinide'),
    mechanism: t('식사와 관련된 짧은 인슐린 분비를 촉진합니다.', 'Promotes short-acting insulin release around meals.', 'Kích thích tiết insulin tác dụng ngắn quanh bữa ăn.'),
    benefit: t('주로 식후혈당을 낮춥니다.', 'Primarily lowers post-meal glucose.', 'Chủ yếu giảm đường huyết sau ăn.'),
    common: t('저혈당·체중 증가.', 'Hypoglycemia and weight gain.', 'Hạ đường huyết và tăng cân.'),
    serious: t('심한 저혈당. 레파글리니드는 일부 다른 약과 중요한 상호작용이 있습니다.', 'Severe hypoglycemia. Repaglinide has important interactions with some other medicines.', 'Hạ đường huyết nặng. Repaglinide có tương tác quan trọng với một số thuốc khác.'),
    lifestyle: t('식사를 거를 때의 복용법은 해당 처방을 확인하세요. 임의로 다른 약과 바꾸지 마세요.', 'Check your prescribed instructions for missed meals; do not substitute another medicine yourself.', 'Kiểm tra hướng dẫn khi bỏ bữa; không tự thay bằng thuốc khác.'),
    low: true, refs: ['medicines', 'repaglinide']
  },
  tzd: {
    name: t('티아졸리딘디온 · TZD', 'Thiazolidinedione · TZD', 'Thiazolidinedione · TZD'),
    mechanism: t('PPAR-γ 경로를 통해 인슐린 감수성을 개선합니다.', 'Improves insulin sensitivity through PPAR-gamma signaling.', 'Cải thiện nhạy insulin qua PPAR-gamma.'),
    benefit: t('인슐린 저항성을 개선하며 단독 저혈당 위험이 낮습니다.', 'Improves insulin resistance with low hypoglycemia risk alone.', 'Cải thiện kháng insulin, ít hạ đường huyết khi đơn độc.'),
    common: t('체중 증가·부종.', 'Weight gain and edema.', 'Tăng cân và phù.'),
    serious: t('심부전 악화·골절 위험. 피오글리타존은 방광암 관련 허가 경고도 개별 확인이 필요합니다.', 'Worsening heart failure and fracture risk. Review ingredient-specific bladder cancer warnings for pioglitazone.', 'Làm nặng suy tim, nguy cơ gãy xương. Xem cảnh báo riêng về ung thư bàng quang với pioglitazone.'),
    lifestyle: t('갑작스러운 체중 증가·다리 부종·숨참을 알리세요. 효과가 서서히 나타날 수 있습니다.', 'Report rapid weight gain, leg swelling or breathlessness. Effects can develop gradually.', 'Báo tăng cân nhanh, phù chân hoặc khó thở. Hiệu quả có thể xuất hiện từ từ.'),
    low: false, refs: ['medicines']
  },
  agi: {
    name: t('알파-글루코시다아제 억제제', 'Alpha-glucosidase inhibitor', 'Thuốc ức chế alpha-glucosidase'),
    mechanism: t('장의 탄수화물 분해를 늦춰 식후혈당 상승을 줄입니다.', 'Slows intestinal carbohydrate digestion to reduce post-meal glucose rises.', 'Làm chậm tiêu hóa carbohydrate ở ruột, giảm tăng đường huyết sau ăn.'),
    benefit: t('식후혈당 개선, 단독 저혈당 위험 낮음.', 'Improves post-meal glucose with low hypoglycemia risk alone.', 'Cải thiện đường huyết sau ăn, ít hạ đường huyết khi đơn độc.'),
    common: t('가스·복부팽만·설사.', 'Gas, bloating and diarrhea.', 'Đầy hơi, chướng bụng và tiêu chảy.'),
    serious: t('성분에 따라 간기능·장질환 관련 주의가 있습니다. 병용 저혈당 대처에 포도당이 필요합니다.', 'Ingredient-specific liver and intestinal cautions apply. Use glucose to treat combination-related hypoglycemia.', 'Có lưu ý gan và ruột theo hoạt chất. Dùng glucose xử trí hạ đường huyết khi phối hợp.'),
    lifestyle: t('식사 시작과 관련된 복용법을 제품별로 확인하세요. 아카보스 사용 시 저혈당에는 설탕 대신 포도당.', 'Check meal-related instructions for the product. With acarbose, use glucose, not table sugar, for hypoglycemia.', 'Kiểm tra cách dùng theo bữa của sản phẩm. Với acarbose, xử trí hạ đường huyết bằng glucose, không phải đường ăn.'),
    low: false, refs: ['medicines', 'acarbose']
  },
  glp1: {
    name: t('GLP-1 수용체 작용제', 'GLP-1 receptor agonist', 'Thuốc chủ vận thụ thể GLP-1'),
    mechanism: t('혈당 의존적 인슐린 분비를 돕고 글루카곤·식욕·위 배출에 작용합니다.', 'Supports glucose-dependent insulin secretion and affects glucagon, appetite and gastric emptying.', 'Hỗ trợ tiết insulin phụ thuộc glucose, tác động glucagon, cảm giác thèm ăn và làm rỗng dạ dày.'),
    benefit: t('혈당과 체중 개선. 심혈관·콩팥 이익은 입증된 성분과 연구 대상을 확인해야 합니다.', 'Improves glucose and weight. Heart and kidney benefits depend on the ingredient and studied population.', 'Cải thiện đường huyết, cân nặng. Lợi ích tim và thận phụ thuộc hoạt chất và nhóm được nghiên cứu.'),
    common: t('메스꺼움·구토·설사·변비.', 'Nausea, vomiting, diarrhea or constipation.', 'Buồn nôn, nôn, tiêu chảy hoặc táo bón.'),
    serious: t('췌장염·담낭질환·탈수 관련 주의. 갑상선 수질암/MEN2 금기 등은 성분·제품별 허가사항을 확인합니다.', 'Review pancreatitis, gallbladder and dehydration cautions. Medullary thyroid cancer/MEN2 contraindications are product-specific.', 'Xem lưu ý viêm tụy, túi mật và mất nước. Chống chỉ định ung thư tuyến giáp thể tủy/MEN2 theo sản phẩm.'),
    lifestyle: t('심한 지속 복통·구토를 알리세요. 수술·마취 전 복용 사실을 알리고, 먹는 제형은 별도 복용 조건을 확인하세요.', 'Report severe persistent abdominal pain or vomiting. Inform anesthesia teams and check special instructions for oral formulations.', 'Báo đau bụng nặng kéo dài hoặc nôn. Báo nhóm gây mê và kiểm tra điều kiện riêng của dạng uống.'),
    low: false, refs: ['medicines', 'cardiovascular']
  },
  dual: {
    name: t('GIP/GLP-1 이중 작용제', 'Dual GIP/GLP-1 agonist', 'Thuốc chủ vận kép GIP/GLP-1'),
    mechanism: t('GIP와 GLP-1 수용체에 작용해 혈당 조절·식욕·체중에 영향을 줍니다.', 'Acts on GIP and GLP-1 receptors to affect glucose regulation, appetite and weight.', 'Tác động thụ thể GIP và GLP-1, ảnh hưởng đường huyết, thèm ăn và cân nặng.'),
    benefit: t('티르제파타이드는 혈당·체중 개선 효과가 있습니다. 연구별 대상·용량·비교약에 따라 효과가 다릅니다.', 'Tirzepatide improves glucose and weight; results depend on population, dose and comparator.', 'Tirzepatide cải thiện đường huyết và cân nặng; kết quả theo đối tượng, liều và thuốc so sánh.'),
    common: t('메스꺼움·구토·설사·변비.', 'Nausea, vomiting, diarrhea or constipation.', 'Buồn nôn, nôn, tiêu chảy hoặc táo bón.'),
    serious: t('췌장염·담낭질환·탈수 관련 경고, 갑상선 수질암/MEN2 금기를 해당 제품에서 확인하세요.', 'Review pancreatitis, gallbladder and dehydration warnings and the product’s medullary thyroid cancer/MEN2 contraindications.', 'Xem cảnh báo viêm tụy, túi mật, mất nước và chống chỉ định ung thư tuyến giáp thể tủy/MEN2 của sản phẩm.'),
    lifestyle: t('소화기 증상·섭취량 감소를 관찰하고, 경구피임약·수술·마취 관련 설명을 의료진에게 확인하세요.', 'Monitor digestive symptoms and reduced intake; ask about oral contraceptives, surgery and anesthesia.', 'Theo dõi triệu chứng tiêu hóa và ăn ít; hỏi về thuốc tránh thai uống, phẫu thuật và gây mê.'),
    low: false, refs: ['medicines']
  },
  insulin: {
    name: t('인슐린', 'Insulin', 'Insulin'),
    mechanism: t('부족한 인슐린을 보충해 포도당 이용과 간의 포도당 생산을 조절합니다.', 'Replaces insufficient insulin to regulate glucose uptake and liver production.', 'Bổ sung insulin thiếu để điều chỉnh hấp thu glucose và sản xuất ở gan.'),
    benefit: t('1형에서는 필수이며, 2형에서도 필요에 따라 효과적인 치료입니다.', 'Essential in type 1 and effective when needed in type 2.', 'Thiết yếu ở típ 1 và hiệu quả khi cần ở típ 2.'),
    common: t('저혈당·체중 증가·주사 부위 반응.', 'Hypoglycemia, weight gain and injection-site reactions.', 'Hạ đường huyết, tăng cân và phản ứng chỗ tiêm.'),
    serious: t('심한 저혈당. 성분·농도·펜의 혼동은 위험합니다.', 'Severe hypoglycemia. Confusing ingredients, concentrations or pens can be dangerous.', 'Hạ đường huyết nặng. Nhầm hoạt chất, nồng độ hoặc bút tiêm có thể nguy hiểm.'),
    lifestyle: t('주사 부위를 순환하고, 식사·운동·아픈 날 계획을 교육받으세요. 기저·식사·혼합 제형을 임의로 바꾸지 마세요.', 'Rotate injection sites and learn meal, exercise and sick-day plans. Do not interchange basal, mealtime or mixed formulations yourself.', 'Luân phiên chỗ tiêm và học kế hoạch bữa ăn, vận động, ngày bị bệnh. Không tự đổi dạng nền, bữa ăn hoặc hỗn hợp.'),
    low: true, refs: ['medicines', 'hypoglycemia']
  }
};
const d = (id, ko, vi, cls, aliases = [], refs = []) => ({ id, name: t(ko, id.replaceAll('-', ' '), vi), class: cls, aliases: [id, id.replaceAll('-', ' '), ko, vi, ...aliases], refs });
export const ingredients = [
  d('metformin', '메트포르민', 'metformin', 'metformin', ['메트포민', '메트포르민염산염', 'metformin hydrochloride', 'metformin hcl'], ['janumet']),
  d('sitagliptin', '시타글립틴', 'sitagliptin', 'dpp4', ['시타글립틴인산염', '시타글립틴인산염수화물', 'sitagliptin phosphate', 'sitagliptin phosphate monohydrate'], ['janumet']),
  d('linagliptin', '리나글립틴', 'linagliptin', 'dpp4'),
  d('saxagliptin', '삭사글립틴', 'saxagliptin', 'dpp4', [], ['saxagliptin']),
  d('alogliptin', '알로글립틴', 'alogliptin', 'dpp4', [], ['alogliptin']),
  d('vildagliptin', '빌다글립틴', 'vildagliptin', 'dpp4'),
  d('gemigliptin', '제미글립틴', 'gemigliptin', 'dpp4'),
  d('teneligliptin', '테네리글립틴', 'teneligliptin', 'dpp4'),
  d('evogliptin', '에보글립틴', 'evogliptin', 'dpp4'),
  d('anagliptin', '아나글립틴', 'anagliptin', 'dpp4'),
  d('dapagliflozin', '다파글리플로진', 'dapagliflozin', 'sglt2', ['다파글리플로진프로판디올일수화물', 'dapagliflozin propanediol monohydrate']),
  d('empagliflozin', '엠파글리플로진', 'empagliflozin', 'sglt2', [], ['synjardy']),
  d('canagliflozin', '카나글리플로진', 'canagliflozin', 'sglt2'),
  d('ertugliflozin', '에르투글리플로진', 'ertugliflozin', 'sglt2'),
  d('ipragliflozin', '이프라글리플로진', 'ipragliflozin', 'sglt2'),
  d('enavogliflozin', '에나보글리플로진', 'enavogliflozin', 'sglt2'),
  d('glimepiride', '글리메피리드', 'glimepiride', 'su'),
  d('gliclazide', '글리클라지드', 'gliclazide', 'su'),
  d('glipizide', '글리피지드', 'glipizide', 'su'),
  d('glibenclamide', '글리벤클라미드', 'glibenclamide', 'su', ['glyburide', '글리부리드']),
  d('repaglinide', '레파글리니드', 'repaglinide', 'glinide', [], ['repaglinide']),
  d('nateglinide', '나테글리니드', 'nateglinide', 'glinide'),
  d('mitiglinide', '미티글리니드', 'mitiglinide', 'glinide'),
  d('pioglitazone', '피오글리타존', 'pioglitazone', 'tzd', [], ['pioglitazone']),
  d('lobeglitazone', '로베글리타존', 'lobeglitazone', 'tzd'),
  d('acarbose', '아카보스', 'acarbose', 'agi', [], ['acarbose']),
  d('voglibose', '보글리보스', 'voglibose', 'agi'),
  d('miglitol', '미글리톨', 'miglitol', 'agi'),
  d('semaglutide', '세마글루타이드', 'semaglutide', 'glp1', [], ['semaglutide']),
  d('liraglutide', '리라글루타이드', 'liraglutide', 'glp1'),
  d('dulaglutide', '둘라글루타이드', 'dulaglutide', 'glp1'),
  d('exenatide', '엑세나타이드', 'exenatide', 'glp1'),
  d('lixisenatide', '릭시세나타이드', 'lixisenatide', 'glp1'),
  d('tirzepatide', '티르제파타이드', 'tirzepatide', 'dual', [], ['tirzepatide']),
  d('insulin-glargine', '인슐린 글라진', 'insulin glargine', 'insulin', ['글라진', '인슐린글라진']),
  d('insulin-degludec', '인슐린 데글루덱', 'insulin degludec', 'insulin', ['데글루덱', '인슐린데글루덱']),
  d('insulin-detemir', '인슐린 데테미르', 'insulin detemir', 'insulin', ['데테미르', '인슐린데테미르']),
  d('insulin-lispro', '인슐린 리스프로', 'insulin lispro', 'insulin', ['리스프로', '인슐린리스프로']),
  d('insulin-aspart', '인슐린 아스파트', 'insulin aspart', 'insulin', ['아스파트', '인슐린아스파트']),
  d('insulin-glulisine', '인슐린 글루리신', 'insulin glulisine', 'insulin', ['글루리신', '인슐린글루리신']),
  d('regular-insulin', '사람 인슐린', 'insulin người', 'insulin', ['휴먼인슐린', 'human insulin', 'insulin human']),
  d('nph-insulin', 'NPH 인슐린', 'insulin NPH', 'insulin', ['nph', 'isophane insulin', '인슐린이소판'])
];
// Non-diabetes ingredients recognized only to expose specific documented interactions.
export const contextIngredients = [
  { id: 'gemfibrozil', aliases: ['gemfibrozil', '겜피브로질', '젬피브로질'] },
  { id: 'clopidogrel', aliases: ['clopidogrel', '클로피도그렐'] }
];
export const rules = {
  semaglutide: { title: t('세마글루타이드: 눈·제형 확인', 'Semaglutide: eyes and formulation', 'Semaglutide: mắt và dạng thuốc'), text: t('주사 세마글루타이드 허가사항에는 망막병증 합병증 경고가 있습니다. 기존 망막병증과 급격한 혈당 개선을 의료진과 검토하고 시력 변화를 알리세요. 주사와 먹는 제형의 용법·적응증은 같지 않습니다.', 'Injectable semaglutide labeling includes a retinopathy complication warning. Review existing retinopathy and rapid glucose improvement, and report vision changes. Injectable and oral instructions and indications differ.', 'Nhãn semaglutide tiêm có cảnh báo biến chứng võng mạc. Xem bệnh võng mạc sẵn có, giảm đường huyết nhanh và báo thay đổi thị lực. Cách dùng, chỉ định dạng tiêm và uống khác nhau.'), refs: ['semaglutide', 'medicines'] },
  alogliptin: { title: t('알로글립틴: 심부전 위험 확인', 'Alogliptin: review heart failure risk', 'Alogliptin: xem nguy cơ suy tim'), text: t('미국 허가사항은 심부전 위험군에서 이익·위험을 검토하고 증상을 관찰하도록 합니다. 심부전·신장기능 저하 병력을 알리세요.', 'The US label calls for benefit-risk review and symptom monitoring in people at risk of heart failure. Share any heart failure or kidney impairment history.', 'Nhãn Hoa Kỳ yêu cầu xem lợi ích-nguy cơ và theo dõi triệu chứng ở người nguy cơ suy tim. Báo tiền sử suy tim hoặc suy giảm chức năng thận.'), refs: ['alogliptin'] },
  incomplete: { title: t('확인되지 않은 성분이 있습니다', 'Some ingredients are unverified', 'Có hoạt chất chưa xác định'), text: t('아래 결과는 확인된 성분에 한정됩니다. 결과가 없다는 것은 안전하다는 뜻이 아닙니다. 약봉투의 정확한 성분명을 다시 확인하세요.', 'Results cover recognized ingredients only. No result does not mean safe. Check exact ingredient names on your prescription.', 'Kết quả chỉ gồm hoạt chất nhận diện được. Không có kết quả không có nghĩa an toàn. Kiểm tra tên chính xác trên đơn.'), refs: ['mfds'] },
  duplicate: { title: t('같은 성분이 반복되었습니다', 'Repeated ingredient', 'Hoạt chất lặp lại'), text: t('입력이 반복됐거나 여러 제품에 같은 성분이 들어 있을 수 있습니다. 중복 복용인지 약사에게 확인하세요. 서로 다른 인슐린의 계획된 병용과는 구분합니다.', 'This may be repeated input or the same ingredient in several products. Ask a pharmacist to check duplication. Planned use of different insulins is a different situation.', 'Có thể do nhập lặp hoặc nhiều sản phẩm chứa cùng hoạt chất. Nhờ dược sĩ kiểm tra dùng trùng. Phối hợp có kế hoạch các insulin khác nhau là tình huống khác.'), refs: ['mfds'] },
  hypoglycemia: { title: t('저혈당 대비가 필요한 약물', 'Medicines requiring hypoglycemia preparation', 'Thuốc cần chuẩn bị phòng hạ đường huyết'), text: t('인슐린·설폰요소제·글리나이드가 포함됩니다. 식사 감소·운동·음주 때 위험이 달라지고 다른 혈당강하제와 병용하면 증가할 수 있습니다. 측정·응급 포도당 계획을 확인하세요.', 'Insulin, sulfonylurea or glinide is present. Reduced meals, activity and alcohol change risk; other glucose-lowering medicines can increase it. Review monitoring and rapid glucose plans.', 'Có insulin, sulfonylurea hoặc glinide. Ăn ít, vận động và rượu thay đổi nguy cơ; thuốc hạ đường huyết khác có thể làm tăng. Xem kế hoạch đo và glucose nhanh.'), refs: ['hypoglycemia', 'medicines'] },
  dppIncretin: { title: t('인크레틴 계열 조합 확인', 'Review an incretin combination', 'Kiểm tra phối hợp incretin'), text: t('DPP-4 억제제와 GLP-1 또는 GIP/GLP-1 작용제 병용은 추가 이익이 부족해 일반적으로 권장되지 않습니다. 처방 의도를 확인하세요. 스스로 중단하지 마세요.', 'Combining a DPP-4 inhibitor with GLP-1 or GIP/GLP-1 therapy is generally not recommended because added benefit is limited. Check the prescription intent; do not stop it yourself.', 'Phối hợp DPP-4 với GLP-1 hoặc GIP/GLP-1 thường không được khuyến nghị do ít lợi ích thêm. Kiểm tra mục đích đơn; không tự ngừng.'), refs: ['medicines'] },
  acarbose: { title: t('저혈당 대처에는 포도당', 'Use glucose for low blood sugar', 'Dùng glucose khi hạ đường huyết'), text: t('아카보스와 인슐린·분비촉진제를 함께 쓰면 저혈당이 생길 수 있습니다. 아카보스는 설탕 분해를 늦추므로 포도당 정제·젤 등으로 대처하세요. 의식이 없으면 먹이지 말고 응급 도움을 요청합니다.', 'Acarbose with insulin or secretagogues can cause hypoglycemia. Since acarbose delays sucrose digestion, use glucose tablets or gel. Do not feed an unconscious person; call emergency services.', 'Acarbose cùng insulin hoặc thuốc tiết insulin có thể gây hạ đường huyết. Vì acarbose làm chậm tiêu hóa sucrose, dùng viên hoặc gel glucose. Không cho ăn khi bất tỉnh; gọi cấp cứu.'), refs: ['acarbose', 'hypoglycemia'] },
  sameClass: { title: t('같은 계열의 여러 성분', 'Several ingredients in one class', 'Nhiều hoạt chất cùng nhóm'), text: t('같은 계열 성분이 여러 개 있습니다. 계획된 복합제인지 중복인지 확인하세요. 이 표시는 처방 오류를 확정하지 않습니다.', 'Several ingredients share a class. Check whether the combination is intentional or duplicative. This flag does not establish a prescribing error.', 'Có nhiều hoạt chất cùng nhóm. Kiểm tra phối hợp có chủ ý hay trùng lặp. Cảnh báo không kết luận lỗi kê đơn.'), refs: ['medicines'] },
  insulinTzd: { title: t('인슐린과 TZD: 부종·심부전 검토', 'Insulin plus TZD: review edema and heart failure', 'Insulin với TZD: xem phù và suy tim'), text: t('병용 시 체액 저류·심부전 관련 위험을 검토해야 합니다. 갑작스러운 체중 증가·다리 부종·숨참을 의료진에게 알리세요.', 'Review fluid retention and heart failure risk with this combination. Report sudden weight gain, leg swelling or breathlessness.', 'Cần xem nguy cơ giữ dịch và suy tim khi phối hợp. Báo tăng cân đột ngột, phù chân hoặc khó thở.'), refs: ['medicines'] },
  repGem: { title: t('레파글리니드 + 겜피브로질', 'Repaglinide + gemfibrozil', 'Repaglinide + gemfibrozil'), text: t('미국 허가사항에서 병용 금기입니다. 심한 저혈당 위험 때문에 처방·조제 약사에게 신속히 조합을 확인하세요. 이 도구는 중단·변경 용량을 정하지 않습니다.', 'The US label contraindicates this combination due to severe hypoglycemia concerns. Promptly confirm it with your prescriber or pharmacist. This tool does not set discontinuation or dose changes.', 'Nhãn Hoa Kỳ chống chỉ định phối hợp này do nguy cơ hạ đường huyết nặng. Sớm xác nhận với bác sĩ hoặc dược sĩ. Công cụ không quyết định ngừng hay đổi liều.'), refs: ['repaglinide'] },
  repClop: { title: t('레파글리니드 + 클로피도그렐', 'Repaglinide + clopidogrel', 'Repaglinide + clopidogrel'), text: t('미국 허가사항에서 병용 회피를 권고합니다. 약물 농도와 저혈당 위험이 증가할 수 있어 의료진의 검토가 필요합니다.', 'The US label advises avoiding this combination. Increased exposure and hypoglycemia risk require clinician review.', 'Nhãn Hoa Kỳ khuyên tránh phối hợp. Nồng độ thuốc và nguy cơ hạ đường huyết tăng cần bác sĩ đánh giá.'), refs: ['repaglinide'] },
  sax: { title: t('삭사글립틴: 심부전 경고', 'Saxagliptin: heart failure warning', 'Saxagliptin: cảnh báo suy tim'), text: t('심부전 위험이 높은 사람은 이익과 위험을 개별 검토합니다. 숨참·부종·빠른 체중 증가를 알리세요. 이를 모든 DPP-4 성분의 동일한 위험으로 해석하지 않습니다.', 'People at elevated heart failure risk need individualized benefit-risk review. Report breathlessness, edema or rapid weight gain. Do not interpret this as equal risk for all DPP-4 ingredients.', 'Người nguy cơ suy tim cao cần đánh giá lợi ích-nguy cơ riêng. Báo khó thở, phù hoặc tăng cân nhanh. Không xem mọi DPP-4 có nguy cơ giống nhau.'), refs: ['saxagliptin'] },
  renal: { title: t('콩팥 기능에 따른 확인', 'Kidney function review', 'Đánh giá theo chức năng thận'), text: t('메트포르민·일부 DPP-4·인슐린·분비촉진제 등은 신장기능에 따라 위험·용량이 달라집니다. eGFR과 제품별 허가사항을 의료진이 확인해야 합니다. 이 도구는 용량을 계산하지 않습니다.', 'Kidney function changes risk or dosing for metformin, some DPP-4 medicines, insulin and secretagogues. Clinicians should review eGFR and product labels. This tool does not calculate doses.', 'Chức năng thận thay đổi nguy cơ hoặc liều metformin, một số DPP-4, insulin và thuốc tiết insulin. Bác sĩ cần xem eGFR và nhãn sản phẩm. Công cụ không tính liều.'), refs: ['medicines', 'janumet'] },
  heart: { title: t('심부전 병력에 따른 확인', 'Review a heart failure history', 'Đánh giá khi có tiền sử suy tim'), text: t('TZD의 체액 저류·심부전 악화 위험을 검토하세요. SGLT2의 이익과 수분·혈압 계획은 성분과 상태에 따라 판단합니다.', 'Review fluid retention and heart failure worsening with TZDs. SGLT2 benefit and fluid or blood pressure plans depend on ingredient and condition.', 'Xem giữ dịch, làm nặng suy tim với TZD. Lợi ích SGLT2 và kế hoạch dịch, huyết áp theo hoạt chất, tình trạng.'), refs: ['medicines', 'cardiovascular'] },
  sglt2: { title: t('금식·탈수·케톤산증 계획', 'Fasting, dehydration and ketoacidosis plan', 'Kế hoạch nhịn ăn, mất nước và nhiễm toan ceton'), text: t('SGLT2 성분이 포함됩니다. 수술·금식·심한 질병 때 별도 계획을 미리 확인하세요. 심한 구토·복통·빠른 호흡은 혈당이 아주 높지 않아도 신속한 평가가 필요합니다.', 'An SGLT2 ingredient is present. Agree in advance on surgery, fasting and serious illness plans. Severe vomiting, abdominal pain or rapid breathing needs prompt assessment even without very high glucose.', 'Có hoạt chất SGLT2. Thống nhất trước kế hoạch phẫu thuật, nhịn ăn và bệnh nặng. Nôn nặng, đau bụng hoặc thở nhanh cần đánh giá sớm dù đường huyết không quá cao.'), refs: ['synjardy', 'medicines'] }
};
