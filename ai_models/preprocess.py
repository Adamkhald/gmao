import pandas as pd
import numpy as np
import os

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "../public/data")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "processed_data")

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def load_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        print(f"Warning: {filename} not found.")
        return pd.DataFrame()
    return pd.read_csv(path, sep=';', encoding='latin-1') # specific encoding for French chars usually safe

def parse_date(df, date_col):
    # Parse DD/MM/YYYY
    df[date_col] = pd.to_datetime(df[date_col], format='%d/%m/%Y', errors='coerce')
    return df.dropna(subset=[date_col])

def prepare_time_series():
    print("Loading data...")
    amdec_df = load_csv("AMDEC.csv")
    gmao_df = load_csv("GMAO_Integrator.csv")
    workload_df = load_csv("Workload.csv")

    # 1. Failure & Downtime Data (AMDEC + GMAO)
    failures = pd.concat([amdec_df, gmao_df], ignore_index=True)
    
    # Identify columns
    # We look for 'Date intervention', 'Durée arrêt (h)'
    # Note: Column names might have slight variations or hidden spaces, so we clean them
    failures.columns = [c.strip() for c in failures.columns]
    
    date_col = 'Date intervention'
    duree_col = 'Durée arrêt (h)'
    
    if date_col in failures.columns:
        failures = parse_date(failures, date_col)
        # Convert Duration to float (handle comma as decimal)
        if duree_col in failures.columns:
            failures[duree_col] = failures[duree_col].astype(str).str.replace(',', '.').apply(pd.to_numeric, errors='coerce').fillna(0)
            
        # Aggregate by Week
        failures.set_index(date_col, inplace=True)
        weekly_failures = failures.resample('W-MON').agg({
            duree_col: 'sum',          # Total downtime
            'Type de panne': 'count'   # Total failure count
        }).rename(columns={'Type de panne': 'FailureCount', duree_col: 'TotalDowntime'})
        
        # Fill missing weeks with 0
        weekly_failures = weekly_failures.fillna(0)
        
        print(f"Processed Failures: {len(weekly_failures)} weeks")
        weekly_failures.to_csv(os.path.join(OUTPUT_DIR, "weekly_failures.csv"))
    else:
        print(f"Error: '{date_col}' not found in failure data.")

    # 2. Workload Data
    workload_df.columns = [c.strip() for c in workload_df.columns]
    
    # Check for 'Nombre d'heures' or similar
    # Sometimes header is like "[MO interne].Nombre d'heures"
    hours_col = next((c for c in workload_df.columns if "heures" in c.lower()), None)
    cost_col = next((c for c in workload_df.columns if "coût" in c.lower() and "intervention" in c.lower()), None)
    
    if date_col in workload_df.columns and hours_col:
        workload_df = parse_date(workload_df, date_col)
        
        # Clean numeric
        workload_df[hours_col] = workload_df[hours_col].astype(str).str.replace(',', '.').apply(pd.to_numeric, errors='coerce').fillna(0)
        if cost_col:
            workload_df[cost_col] = workload_df[cost_col].astype(str).str.replace(',', '.').apply(pd.to_numeric, errors='coerce').fillna(0)

        workload_df.set_index(date_col, inplace=True)
        
        agg_dict = {hours_col: 'sum'}
        if cost_col:
            agg_dict[cost_col] = 'sum'
            
        weekly_workload = workload_df.resample('W-MON').agg(agg_dict)
        
        # Rename for clarity
        cols_map = {hours_col: 'TotalHours'}
        if cost_col:
            cols_map[cost_col] = 'TotalCost'
        weekly_workload.rename(columns=cols_map, inplace=True)
        
        weekly_workload = weekly_workload.fillna(0)
        
        print(f"Processed Workload: {len(weekly_workload)} weeks")
        weekly_workload.to_csv(os.path.join(OUTPUT_DIR, "weekly_workload.csv"))
    else:
         print(f"Error: Date or Hours column not found in Workload data. Columns found: {workload_df.columns}")

if __name__ == "__main__":
    prepare_time_series()
