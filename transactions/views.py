from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Sum
from .models import Transaction
from django.contrib.auth import login
import random
import json
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .ml_engine.predictor import predict_single, predict_batch


# --- 1. THE LANDING PAGE ---
def home(request):
    return render(request, 'transactions/webpage.html')


# --- 2. THE DASHBOARD (Protected) ---
@login_required(login_url='login')  # <--- CRITICAL: Protects the dashboard
def dashboard(request):
    # 1. Fetch all transactions (Newest first)
    all_transactions = Transaction.objects.all().order_by('-timestamp')
    
    # 2. KPI CALCULATIONS
    total_scanned = all_transactions.count()
    high_risk_count = all_transactions.filter(is_fraud=True).count()
    
    # Calculate Sum safely
    fraud_sum = all_transactions.filter(is_fraud=True).aggregate(Sum('amount'))['amount__sum']
    if fraud_sum is None:
        fraud_sum = 0
        
    # Simulate Latency
    latency = random.randint(12, 45) 
    
    # Safe Count
    safe_count = total_scanned - high_risk_count
    
    # 3. CHART DATA (Last 10 transactions)
    recent_10 = list(all_transactions[:10])[::-1]
    chart_labels = [t.transaction_id for t in recent_10]
    chart_amounts = [float(t.amount) for t in recent_10]
    
    chart_data = {
        'fraud_count': high_risk_count,
        'safe_count': safe_count,
        'labels': chart_labels,
        'amounts': chart_amounts
    }

    # 4. Send ALL variables to HTML
    return render(request, 'transactions/dashboard.html', {
        'transactions': all_transactions,
        'total_scanned': total_scanned,
        'high_risk_count': high_risk_count,
        'fraud_prevented': fraud_sum,
        'latency': latency,
        'chart_data': json.dumps(chart_data)
    })


# --- 3. SIGNUP LOGIC (The Fix) ---
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # 1. Log the user in immediately (Better UX)
            login(request, user)
            
            # 2. Redirect to the URL name 'dashboard' 
            # (NOT 'dashboard.html' or 'login.html')
            return redirect('dashboard') 
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})


# --- 4. AI PREDICTION API ---
@csrf_exempt
def predict(request):
    """Real-time single transaction prediction."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            result = predict_single(data)

            # Save prediction to database
            Transaction.objects.create(
                transaction_id=f"TXN-{random.randint(1000,9999)}",
                amount=float(data['amount']),
                location="Manual Entry",
                is_fraud=result['is_fraud']
            )

            return JsonResponse({
                'success': True,
                **result
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

    return JsonResponse({'error': 'POST required'}, status=405)

@csrf_exempt
def predict_csv(request):
    """Batch prediction from uploaded CSV."""
    if request.method == 'POST' and request.FILES.get('csv_file'):
        try:
            csv_file = request.FILES['csv_file']
            df       = pd.read_csv(csv_file)

            required = ['step','type','amount','oldbalanceOrg',
                        'newbalanceOrig','oldbalanceDest','newbalanceDest']
            missing  = [c for c in required if c not in df.columns]
            if missing:
                return JsonResponse({
                    'success': False,
                    'error': f'Missing columns: {missing}'
                }, status=400)

            results = predict_batch(df)

            for r in results:
                Transaction.objects.create(
                    transaction_id=f"CSV-{r['row']}",
                    amount=r['amount'],
                    location="CSV Upload",
                    is_fraud=r['is_fraud']
                )

            fraud_ct = sum(1 for r in results if r['is_fraud'])
        
            return JsonResponse({
                'success':     True,
                'total':       len(results),
                'fraud_count': fraud_ct,
                'results':     results[:500]  # cap at 500 rows for response size
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST with csv_file required'}, status=405)    