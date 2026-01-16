<?php
// admin/settings/bandwidth-monitor.php
require_once __DIR__ . '/../../includes/db.php';

$currentPage = 'settings';
$pageTitle = 'Bandwidth Monitor';
require_once __DIR__ . '/../includes/header.php';

$pdo = getDBConnection();

// Get filter date range (default usually current month)
$month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
$startDate = $month . '-01';
$endDate = date('Y-m-t', strtotime($startDate));

// Fetch daily data for the selected month
$stmt = $pdo->prepare("SELECT * FROM bandwidth_usage WHERE date BETWEEN ? AND ? ORDER BY date ASC");
$stmt->execute([$startDate, $endDate]);
$dailyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate totals
$totalBytes = 0;
$totalHits = 0;
foreach ($dailyData as $day) {
    $totalBytes += $day['bytes'];
    $totalHits += $day['hits'];
}

// Prepare chart data
$chartLabels = [];
$chartBytes = [];
$chartHits = [];

foreach ($dailyData as $day) {
    $chartLabels[] = date('d M', strtotime($day['date']));
    $chartBytes[] = round($day['bytes'] / (1024 * 1024), 2); // MB
    $chartHits[] = $day['hits'];
}

// Function to format bytes
function formatBytes($bytes, $precision = 2)
{
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}
?>

<div class="page-header">
    <h1 class="page-title">Bandwidth Monitor</h1>
    <div class="page-actions">
        <form method="GET" class="d-flex align-items-center gap-2">
            <input type="month" name="month" class="form-control" value="<?php echo htmlspecialchars($month); ?>"
                onchange="this.form.submit()">
        </form>
    </div>
</div>

<div class="content-wrapper">
    <!-- Stats Cards -->
    <div class="row mb-4" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="col-md-6" style="flex: 1; min-width: 300px;">
            <div class="card p-4">
                <div class="d-flex align-items-center">
                    <div class="icon-box bg-primary-light text-primary me-3"
                        style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; font-size: 1.5rem;">
                        <i class="fa fa-server"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1" style="color: #64748b; margin: 0;">Total Bandwidth (
                            <?php echo date('M Y', strtotime($startDate)); ?>)
                        </h6>
                        <h3 class="mb-0" style="font-size: 1.75rem; font-weight: 700; margin: 5px 0 0;">
                            <?php echo formatBytes($totalBytes); ?>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6" style="flex: 1; min-width: 300px;">
            <div class="card p-4">
                <div class="d-flex align-items-center">
                    <div class="icon-box bg-success-light text-success me-3"
                        style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(34, 197, 94, 0.1); color: #22c55e; font-size: 1.5rem;">
                        <i class="fa fa-globe"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1" style="color: #64748b; margin: 0;">Total Requests (
                            <?php echo date('M Y', strtotime($startDate)); ?>)
                        </h6>
                        <h3 class="mb-0" style="font-size: 1.75rem; font-weight: 700; margin: 5px 0 0;">
                            <?php echo number_format($totalHits); ?>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts -->
    <div class="card mb-4 p-4">
        <h4 class="card-title mb-4">Daily Usage</h4>
        <div style="height: 400px;">
            <canvas id="bandwidthChart"></canvas>
        </div>
    </div>

    <!-- Data Table -->
    <div class="card">
        <div class="card-header p-4 border-bottom">
            <h4 class="card-title m-0">Daily Breakdown</h4>
        </div>
        <div class="table-responsive">
            <table class="table table-hover" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8fafc; text-align: left;">
                        <th style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">Date</th>
                        <th style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">Requests</th>
                        <th style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">Bandwidth</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($dailyData)): ?>
                        <tr>
                            <td colspan="3" style="padding: 2rem; text-align: center; color: #64748b;">No data recorded for
                                this month.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach (array_reverse($dailyData) as $day): ?>
                            <tr>
                                <td style="padding: 1rem; border-bottom: 1px solid #f1f5f9;">
                                    <?php echo date('M d, Y', strtotime($day['date'])); ?>
                                </td>
                                <td style="padding: 1rem; border-bottom: 1px solid #f1f5f9;">
                                    <?php echo number_format($day['hits']); ?>
                                </td>
                                <td style="padding: 1rem; border-bottom: 1px solid #f1f5f9; font-weight: 600;">
                                    <?php echo formatBytes($day['bytes']); ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('bandwidthChart').getContext('2d');
    const bandwidthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: <?php echo json_encode($chartLabels); ?>,
        datasets: [{
            label: 'Bandwidth (MB)',
            data: <?php echo json_encode($chartBytes); ?>,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
            }, {
        label: 'Requests',
        data: <?php echo json_encode($chartHits); ?>,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
            }]
        },
    options: {
        responsive: true,
            maintainAspectRatio: false,
                interaction: {
            mode: 'index',
                intersect: false,
            },
        plugins: {
            legend: {
                position: 'top',
                },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.yAxisID === 'y') {
                            label += context.parsed.y + ' MB';
                        } else {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                    display: true,
                        position: 'left',
                            title: {
                    display: true,
                        text: 'Bandwidth (MB)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y1: {
                type: 'linear',
                    display: true,
                        position: 'right',
                            title: {
                    display: true,
                        text: 'Requests'
                },
                grid: {
                    drawOnChartArea: false,
                    }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>