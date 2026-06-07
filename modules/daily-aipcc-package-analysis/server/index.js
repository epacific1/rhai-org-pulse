/**
 * @param {import('express').Router} router
 * @param {import('@shared/server/module-context').ModuleContext} context
 */
module.exports = function registerRoutes(router, context) {
  const { storage: _storage, requireScope } = context

  /**
   * @openapi
   * /api/modules/daily-aipcc-package-analysis/reports:
   *   get:
   *     tags: [Package Analysis]
   *     summary: List all reports (summaries only)
   *     responses:
   *       200:
   *         description: Array of report summaries
   */
  router.get('/reports', function(req, res) {
    res.json([])
  })

  context.registerDiagnostics(async function() {
    return { status: 'ok' }
  })
}
